import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { toFile } from "openai/uploads";
import openai from "@/lib/openai-client";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CV_PROFILE_PHOTO_BUNDLE_PRODUCT } from "@/lib/polar";
import { claimProfilePhotoBundle, hasAvailableProfilePhotoBundle } from "@/lib/profile-photo-entitlements";
import { checkRateLimit, getClientIp } from "@/lib/tools/rate-limit";
import { saveProfilePhotoImage, StoredProfilePhotoImage } from "@/lib/profile-photo-storage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_FILES = 4;
const MAX_TOTAL_SIZE = 24 * 1024 * 1024;
const MAX_REFINEMENT_LENGTH = 300;
const MAX_REFINEMENTS = 2;
const MAX_GENERATIONS = 1;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const stylePrompts: Record<string, string> = {
  executive:
    "Professional corporate headshot of the person in the reference image, photographed in a high-end studio setting. Sharp business attire: tailored dark suit or blazer, crisp white or light blue shirt, subtle tie or elegant blouse for women. Neutral gradient background in warm charcoal or deep slate grey (#2C2C2C to #4A4A4A). Rembrandt lighting setup: single key light at 45 degrees with a soft fill reflector, creating gentle shadow depth on one side of the face. Expression: composed, authoritative, slight confident smile. Direct eye contact with lens. Shot at 85mm equivalent focal length, shallow depth of field, subject perfectly sharp. Color grading: slightly desaturated with lifted blacks for a premium editorial feel. No distracting background elements. LinkedIn-optimized 1:1 crop with face filling 60% of frame.",
  creatief:
    "Creative professional headshot of the person in the reference image, photographed with intentional editorial style. Smart-casual attire with a distinctive element: structured jacket in an interesting texture or a bold color pop accessory. Background: blurred modern workspace or studio environment with soft bokeh, warm neutral tones such as cream, terracotta, or soft sage. Natural window light from camera-left creating soft directional illumination with a subtle catch light in the eyes. Expression: approachable, engaged, genuine smile showing personality. Slight 3/4 body angle, but face turned toward camera with direct eye contact. Shot at 85mm, f/2.0. Color grading: warm, slightly elevated saturation, clean skin tones. Artful without being unprofessional. Instagram-portfolio ready, also clean enough for LinkedIn.",
  tech:
    "Modern tech founder headshot of the person in the reference image, clean and contemporary aesthetic. Smart-casual attire: quality crewneck, minimalist open-collar shirt, or unstructured blazer, no tie. Background: pure white, light concrete texture, or soft out-of-focus modern office interior in light greys and whites. Flat front lighting or softbox setup for an editorial-clean look with zero harsh shadows. Expression: confident, direct, slightly informal, approachable authority. Slight forward lean suggesting energy and engagement, while face remains front-facing and centered. Shot tightly framed head and shoulders, 85mm equivalent, very clean and uncluttered. Color grading: cool-neutral tones, high clarity, slightly high-key exposure. Y Combinator demo day meets Wired magazine cover: founder credibility without corporate stiffness.",
  zorg:
    "Trustworthy healthcare professional headshot of the person in the reference image. Attire: clean white coat over professional clothing, or neat clinical scrubs in navy or teal. Optional: stethoscope draped naturally around neck if it fits the image. Background: soft clinical white or very light grey, clean, sterile, reassuring. Gentle clamshell lighting for even, flattering, shadow-free illumination that communicates approachability and trust. Expression: warm, genuine, empathetic smile, the look that makes patients feel safe. Direct eye contact. Shot at 85mm, f/2.8, tight head-and-shoulders crop. Color grading: neutral and clean, slightly warm skin tones, crisp whites. No stylization: pure competence and care. Suitable for hospital website, Zorgkaart Nederland profile, and practice website.",
  consultant:
    "Intellectual authority headshot of the person in the reference image in a distinguished academic or consulting context. Smart professional attire: blazer or jacket, tweed, herringbone, or structured wool texture adds gravitas, open collar or subtle tie, no overly corporate feel. Background: soft-focus bookshelf filled with books, warm wood tones, or muted library interior, shot at f/1.8 to create rich background separation. Rembrandt or split lighting for intellectual depth, warm tungsten key light balanced with soft fill. Expression: thoughtful, composed, intelligent, slight hint of a knowing smile. Slight 3/4 body angle, face toward camera with direct eye contact. Color grading: warm, slightly desaturated, film-like quality with lifted shadows. Harvard Faculty meets McKinsey senior partner: credible, published, trusted.",
  client:
    "Energetic and approachable client-facing professional headshot of the person in the reference image. Polished business-casual attire: smart blazer, neat open collar, or professional blouse/shirt in approachable colors such as navy, cobalt, burgundy, or warm grey. Background: softly blurred modern office or collaborative workspace in warm neutral tones, friendly, not sterile. Butterfly or beauty-dish lighting for an open, welcoming, energetic look. Expression: genuine wide smile, open and warm, the face you want to pick up the phone to. Slight forward lean. Shot at 85mm, f/2.2. Color grading: warm, vibrant, slightly elevated contrast and saturation, energetic without being garish. Ideal for LinkedIn, CRM profiles, email signatures, and company team pages.",
  linkedin:
    "Clean universal professional headshot of the person in the reference image, optimized for CV and LinkedIn. Neat professional attire: plain blazer, button-up shirt or blouse in neutral or classic colors such as navy, white, grey, or black. Plain background in soft neutral grey (#E8E8E8 to #D0D0D0 gradient), or clean white, ATS and recruiter-safe. Even softbox or ring-light illumination, completely shadow-free and flattering. Expression: natural, pleasant, professional resting expression with a subtle approachable smile. Direct eye contact. Centered composition, face filling 55-65% of frame, standard LinkedIn 1:1 aspect ratio. Color grading: neutral, accurate skin tones, no stylization, no filters. Crisp and sharp throughout. Works on any CV template, any LinkedIn profile, any nationality, any industry: maximum versatility.",
};

function sanitizeFileName(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
  return cleanName || "profile-photo.jpg";
}

function imageUrl(projectId: string, imageId: string): string {
  return `/api/profile-photo/images/${encodeURIComponent(imageId)}?projectId=${encodeURIComponent(projectId)}`;
}

function parseImages(value: Prisma.JsonValue | null | undefined): StoredProfilePhotoImage[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is StoredProfilePhotoImage => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    const record = item as Record<string, unknown>;
    return typeof record.id === "string" && typeof record.filename === "string";
  });
}

function serializeImages(projectId: string, images: StoredProfilePhotoImage[]) {
  return images.map((image) => ({
    id: image.id,
    url: imageUrl(projectId, image.id),
    kind: image.kind,
    style: image.style,
    createdAt: image.createdAt,
  }));
}

function buildPrompt(style: string): string {
  const selectedStyle = stylePrompts[style] ?? stylePrompts.executive;

  return [
    "Preserve the exact facial features, skin tone, age, and likeness of the person in the reference image. Only modify lighting, background, attire context, composition, and color grading as described. The result must be photorealistic, not illustrated, stylized, painted, or synthetic-looking.",
    "Target the quality of a real professional LinkedIn studio portrait: natural skin texture, realistic hair detail, clear eyes, clean background separation, and believable clothing fabric. The photo should look like it came from a good local business photographer, not an AI filter.",
    "If multiple images are provided, use the first image as the primary identity reference and the other images only as supporting references.",
    "Recompose the person into an upright, front-facing portrait even if the input photo is sideways, angled, turned away, or a casual selfie. The face must be centered and looking directly into the camera with both eyes visible.",
    "Do not preserve a side-facing pose from the input image. Correct head orientation, shoulder angle, and camera perspective into a professional front-facing studio portrait while preserving identity.",
    "Frame the subject from the chest up with ample headroom and negative space above the head. Ensure the top of the head is not cropped. Keep the head vertical, not tilted or rotated.",
    selectedStyle,
    "Avoid glamour retouching, overly perfect skin, influencer styling, unrealistic beauty filters, logos, text, ID-photo stiffness, uniforms unless already present, and major changes to body, face, age, or ethnicity.",
  ].join(" ");
}

function buildRefinementPrompt(instruction: string): string {
  const safeInstruction = instruction.trim().slice(0, MAX_REFINEMENT_LENGTH);

  return [
    "Edit this generated professional portrait based on the user's refinement request.",
    `User request: "${safeInstruction}"`,
    "Keep the same overall portrait style, professional quality, lighting quality, crop, composition, and photorealistic look from the input image.",
    "Preserve the exact facial identity, face shape, age, skin tone, hairstyle unless directly requested, eye appearance, and realistic skin texture.",
    "Apply only the requested change. Do not re-style the image from scratch.",
    "If the user request conflicts with a professional CV, LinkedIn, or job-application profile photo, adapt it into the closest recruiter-safe professional version.",
    "Maintain a front-facing portrait, direct eye contact, chest-up crop, high-resolution photorealistic look, and clean professional presentation.",
    "Do not change ethnicity, age, face structure, body type, or identity. Do not add logos, text, watermarks, fantasy styling, face-covering props, offensive elements, or unrealistic filters.",
  ].join(" ");
}

function getFilesFromFormData(formData: FormData): File[] {
  const photos = formData.getAll("photos").filter((item): item is File => item instanceof File);
  const legacyPhoto = formData.get("photo");

  if (photos.length > 0) {
    return photos;
  }

  return legacyPhoto instanceof File ? [legacyPhoto] : [];
}

function getSafeErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Onbekende fout";
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });

  const projectId = request.nextUrl.searchParams.get("projectId");
  let project = projectId
    ? await prisma.profilePhotoProject.findFirst({ where: { id: projectId, userId: user.id } })
    : await prisma.profilePhotoProject.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

  if (project && project.status !== "paid") {
    const claim = await claimProfilePhotoBundle(user.email, project.id);
    if (claim.claimed) {
      project = await prisma.profilePhotoProject.findFirst({ where: { id: project.id, userId: user.id } });
    }
  }

  let bundleIncluded = await hasAvailableProfilePhotoBundle(user.email);
  if (project?.orderId) {
    const order = await prisma.order.findUnique({
      where: { id: project.orderId },
      select: { product: true },
    });
    bundleIncluded = bundleIncluded || order?.product === CV_PROFILE_PHOTO_BUNDLE_PRODUCT;
  }

  if (!project) {
    return NextResponse.json({
      authenticated: true,
      user: { email: user.email },
      bundleIncluded,
      project: null,
    });
  }

  const images = parseImages(project.images as Prisma.JsonValue | null);

  return NextResponse.json({
    authenticated: true,
    user: { email: user.email },
    bundleIncluded,
    project: {
      id: project.id,
      status: project.status,
      style: project.style,
      generationCount: project.generationCount,
      refinementCount: project.refinementCount,
      refinementsRemaining: Math.max(0, MAX_REFINEMENTS - project.refinementCount),
      maxRefinements: MAX_REFINEMENTS,
      images: serializeImages(project.id, images),
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Log eerst in om je AI-profielfoto te maken." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`${user.id}:${ip}`, {
    bucket: "profile-photo",
    maxRequests: 4,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Je hebt de tijdelijke limiet bereikt. Probeer het later opnieuw." },
      { status: 429 }
    );
  }

  try {
    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Upload eerst een geldige foto." },
        { status: 400 }
      );
    }

    const projectId = String(formData.get("projectId") ?? "").trim();
    const mode = String(formData.get("mode") ?? "generate");
    const photos = getFilesFromFormData(formData);
    const style = String(formData.get("style") ?? "executive");
    const refinement = String(formData.get("refinement") ?? "").trim();

    let project = projectId
      ? await prisma.profilePhotoProject.findFirst({
          where: { id: projectId, userId: user.id },
        })
      : await prisma.profilePhotoProject.create({
          data: {
            userId: user.id,
            status: "draft",
            attribution: (user.attribution || undefined) as Prisma.InputJsonValue | undefined,
          },
        });

    if (!project) {
      return NextResponse.json(
        { error: "Project niet gevonden. Vernieuw de pagina en probeer opnieuw." },
        { status: 404 }
      );
    }

    if (project.status !== "paid") {
      const claim = await claimProfilePhotoBundle(user.email, project.id);
      if (claim.claimed) {
        const claimedProject = await prisma.profilePhotoProject.findFirst({
          where: { id: project.id, userId: user.id },
        });
        if (claimedProject) {
          project = claimedProject;
        }
      }
    }

    if (mode !== "generate" && mode !== "refine") {
      return NextResponse.json(
        { error: "Onbekende bewerkingsmodus." },
        { status: 400 }
      );
    }

    if (mode === "generate" && project.generationCount >= MAX_GENERATIONS) {
      return NextResponse.json(
        { error: "Je eerste set profielfoto's is al gemaakt. Gebruik verfijnen voor kleine aanpassingen." },
        { status: 403 }
      );
    }

    if (mode === "refine" && project.refinementCount >= MAX_REFINEMENTS) {
      return NextResponse.json(
        { error: "Je hebt de 2 inbegrepen verfijningen gebruikt." },
        { status: 403 }
      );
    }

    if (photos.length === 0) {
      return NextResponse.json(
        { error: mode === "refine" ? "Kies eerst een gegenereerde foto om te verfijnen." : "Upload eerst minimaal één foto van jezelf." },
        { status: 400 }
      );
    }

    if (mode === "refine" && photos.length !== 1) {
      return NextResponse.json(
        { error: "Kies precies één gegenereerde foto om te verfijnen." },
        { status: 400 }
      );
    }

    if (mode === "generate" && photos.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Upload maximaal ${MAX_FILES} foto's.` },
        { status: 400 }
      );
    }

    if (mode === "refine" && refinement.length < 3) {
      return NextResponse.json(
        { error: "Beschrijf kort wat je wilt aanpassen." },
        { status: 400 }
      );
    }

    if (refinement.length > MAX_REFINEMENT_LENGTH) {
      return NextResponse.json(
        { error: `Maak je aanpassing korter dan ${MAX_REFINEMENT_LENGTH} tekens.` },
        { status: 400 }
      );
    }

    const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: "Je foto's zijn samen te groot. Upload maximaal 24 MB totaal." },
        { status: 400 }
      );
    }

    const invalidType = photos.find((photo) => !ALLOWED_TYPES.has(photo.type));

    if (invalidType) {
      return NextResponse.json(
        { error: "Gebruik alleen JPG, PNG of WebP-afbeeldingen." },
        { status: 400 }
      );
    }

    const oversizedPhoto = photos.find((photo) => photo.size > MAX_FILE_SIZE);

    if (oversizedPhoto) {
      return NextResponse.json(
        { error: "Eén van je foto's is te groot. Upload maximaal 8 MB per foto." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY ontbreekt. Voeg deze lokaal toe om de profielfoto-generator te testen." },
        { status: 503 }
      );
    }

    const uploadables = await Promise.all(
      photos.map(async (photo) => {
        const buffer = Buffer.from(await photo.arrayBuffer());
        return toFile(buffer, sanitizeFileName(photo.name), {
          type: photo.type,
        });
      })
    );

    const response = await openai.images.edit({
      model: "gpt-image-2",
      image: uploadables.length === 1 ? uploadables[0] : uploadables,
      prompt: mode === "refine" ? buildRefinementPrompt(refinement) : buildPrompt(style),
      n: mode === "refine" ? 2 : 4,
      size: "1024x1024",
      quality: "medium",
      output_format: "jpeg",
      background: "opaque",
    });

    const batchId = `${mode}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const generatedImages = (response.data ?? [])
      .map((image, index) => ({
        id: `profile-photo-${batchId}-${index + 1}`,
        base64: image.b64_json,
      }))
      .filter((image): image is { id: string; base64: string } => Boolean(image.base64));

    if (generatedImages.length === 0) {
      return NextResponse.json(
        { error: "Er is geen afbeelding gegenereerd. Probeer een duidelijkere foto." },
        { status: 502 }
      );
    }

    const storedImages = await Promise.all(
      generatedImages.map(async (image) => {
        const filename = await saveProfilePhotoImage({
          userId: user.id,
          projectId: project.id,
          imageId: image.id,
          base64: image.base64,
        });

        return {
          id: image.id,
          filename,
          kind: mode === "refine" ? "refined" : "generated",
          style,
          createdAt: new Date().toISOString(),
          refinement: mode === "refine" ? refinement : undefined,
        } satisfies StoredProfilePhotoImage;
      })
    );

    const existingImages = parseImages(project.images as Prisma.JsonValue | null);
    const nextImages = [...storedImages, ...existingImages];
    const nextRefinementCount = project.refinementCount + (mode === "refine" ? 1 : 0);
    const nextGenerationCount = project.generationCount + (mode === "generate" ? 1 : 0);

    const updatedProject = await prisma.profilePhotoProject.update({
      where: { id: project.id },
      data: {
        style,
        sourceImageCount: mode === "generate" ? photos.length : project.sourceImageCount,
        generationCount: nextGenerationCount,
        refinementCount: nextRefinementCount,
        images: nextImages as unknown as Prisma.InputJsonValue,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        event: mode === "refine" ? "profile_photo_refined" : "profile_photo_generated",
        path: "/profielfoto-cv-maken",
        properties: {
          projectId: project.id,
          style,
          imagesGenerated: storedImages.length,
          refinementCount: nextRefinementCount,
          generationCount: nextGenerationCount,
        } as Prisma.InputJsonValue,
        attribution: (user.attribution || undefined) as Prisma.InputJsonValue | undefined,
      },
    });

    return NextResponse.json({
      images: serializeImages(project.id, storedImages),
      project: {
        id: project.id,
        status: updatedProject.status,
        generationCount: nextGenerationCount,
        refinementCount: nextRefinementCount,
        refinementsRemaining: Math.max(0, MAX_REFINEMENTS - nextRefinementCount),
        maxRefinements: MAX_REFINEMENTS,
        images: serializeImages(project.id, nextImages),
      },
    });
  } catch (error) {
    console.error("[profile-photo] generation failed", error);
    const debugMessage = process.env.NODE_ENV !== "production" || process.env.PROFILE_PHOTO_DEBUG_ERRORS === "true"
      ? ` Technische fout: ${getSafeErrorMessage(error)}`
      : "";

    return NextResponse.json(
      { error: `De profielfoto kon niet worden gemaakt. Probeer later opnieuw.${debugMessage}` },
      { status: 500 }
    );
  }
}
