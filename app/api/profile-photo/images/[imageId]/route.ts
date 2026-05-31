import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readProfilePhotoImage, StoredProfilePhotoImage } from "@/lib/profile-photo-storage";

export const runtime = "nodejs";

function parseImages(value: Prisma.JsonValue | null | undefined): StoredProfilePhotoImage[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is StoredProfilePhotoImage => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    const record = item as Record<string, unknown>;
    return typeof record.id === "string" && typeof record.filename === "string";
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ imageId: string }> }
) {
  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const { imageId } = await context.params;
  const projectId = request.nextUrl.searchParams.get("projectId");
  const isDownload = request.nextUrl.searchParams.get("download") === "1";

  if (!projectId) {
    return NextResponse.json({ error: "projectId ontbreekt" }, { status: 400 });
  }

  const project = await prisma.profilePhotoProject.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }

  if (isDownload && project.status !== "paid") {
    return NextResponse.json({ error: "Betaal eerst om je profielfoto te downloaden." }, { status: 402 });
  }

  const image = parseImages(project.images as Prisma.JsonValue | null).find((item) => item.id === imageId);

  if (!image) {
    return NextResponse.json({ error: "Afbeelding niet gevonden" }, { status: 404 });
  }

  let buffer: Buffer;

  try {
    buffer = await readProfilePhotoImage({
      userId: user.id,
      projectId: project.id,
      filename: image.filename,
    });
  } catch {
    return NextResponse.json({ error: "Afbeelding niet gevonden" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(buffer.length),
      "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="werkcv-profielfoto-${image.id}.jpg"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
