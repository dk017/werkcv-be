"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { profilePhotoPrice } from "@/lib/site-content";

type GeneratedImage = {
  id: string;
  url?: string;
  kind?: "generated" | "refined";
};

type ProfilePhotoProject = {
  id: string;
  status: "pending" | "paid" | string;
  generationCount: number;
  refinementCount: number;
  refinementsRemaining: number;
  maxRefinements: number;
  images?: GeneratedImage[];
};

type ProfilePhotoStatusResponse = {
  authenticated?: boolean;
  bundleIncluded?: boolean;
  project?: ProfilePhotoProject | null;
};

type StyleOption = {
  id: string;
  label: string;
  description: string;
};

const styleOptions: StyleOption[] = [
  { id: "executive", label: "Corporate executive", description: "Zakelijk, formeel en veilig voor kantoorfuncties." },
  { id: "creatief", label: "Creative professional", description: "Voor design, marketing en meer expressieve rollen." },
  { id: "tech", label: "Tech entrepreneur", description: "Modern, schoon en geschikt voor tech en startups." },
  { id: "zorg", label: "Healthcare", description: "Warm, professioneel en geschikt voor zorg en welzijn." },
  { id: "consultant", label: "Academic / consultant", description: "Meer autoriteit voor consultancy en onderwijs." },
  { id: "client", label: "Sales / client-facing", description: "Toegankelijk en overtuigend voor klantgerichte functies." },
  { id: "linkedin", label: "Clean LinkedIn", description: "Algemeen professioneel en breed inzetbaar." },
];

const maxFileSize = 8 * 1024 * 1024;
const maxFiles = 4;
const maxTotalSize = 24 * 1024 * 1024;
const refinementSuggestions = [
  "lichtere glimlach",
  "minder formeel",
  "meer casual kleding",
  "lichtere achtergrond",
  "donkere achtergrond",
  "meer LinkedIn-stijl",
  "meer cv-stijl",
];

const demoSamples = [
  {
    src: "/profile-photo-samples/dutch-consultant-man.jpg",
    alt: "Voorbeeld van een AI-profielfoto voor een consultant",
    label: "Consultant",
  },
  {
    src: "/profile-photo-samples/dutch-hr-manager-woman.jpg",
    alt: "Voorbeeld van een AI-profielfoto voor een HR manager",
    label: "HR",
  },
  {
    src: "/profile-photo-samples/dutch-starter-woman.jpg",
    alt: "Voorbeeld van een AI-profielfoto voor een starter",
    label: "Starter",
  },
  {
    src: "/profile-photo-samples/dutch-healthcare-professional-woman.jpg",
    alt: "Voorbeeld van een AI-profielfoto voor een zorgprofessional",
    label: "Zorg",
  },
];

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

function formatFileSize(size: number): string {
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function buildImageUrl(projectId: string, imageId: string): string {
  return `/api/profile-photo/images/${encodeURIComponent(imageId)}?projectId=${encodeURIComponent(projectId)}`;
}

function normalizeGeneratedImages(images: GeneratedImage[], projectId?: string): GeneratedImage[] {
  return images.map((image) => {
    if (
      image.url &&
      (image.url.startsWith("/") ||
        image.url.startsWith("http://") ||
        image.url.startsWith("https://") ||
        image.url.startsWith("data:") ||
        image.url.startsWith("blob:"))
    ) {
      return image;
    }

    return {
      ...image,
      url: projectId ? buildImageUrl(projectId, image.id) : image.url,
    };
  });
}

function getStatusCopy(isPaid: boolean, hasBundle: boolean): { title: string; description: string } {
  if (hasBundle) {
    return {
      title: isPaid ? "Je profielfoto zit in je bundle" : "Je cv + profielfoto-bundle is actief",
      description:
        "Upload je foto en maak 4 varianten. Downloaden is al inbegrepen in je bundle, dus je betaalt niet opnieuw.",
    };
  }

  if (isPaid) {
    return {
      title: "Je AI-profielfoto add-on is actief",
      description: "Je kunt je gekozen profielfoto opnieuw downloaden zonder opnieuw te betalen.",
    };
  }

  return {
    title: "Maak eerst gratis je voorbeeldvarianten",
    description: `Log in, maak 4 voorbeeldvarianten en verfijn maximaal 2 keer. Je betaalt pas ${profilePhotoPrice.display} als je wilt downloaden.`,
  };
}

export default function ProfilePhotoGenerator() {
  const pagePath = "/profielfoto-cv-maken";
  const pageAnchorPath = `${pagePath}#profielfoto-tool`;
  const editorPath = "/editor";
  const templatesPath = "/templates";
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "anonymous">("loading");
  const [project, setProject] = useState<ProfilePhotoProject | null>(null);
  const [bundleIncluded, setBundleIncluded] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [style, setStyle] = useState("executive");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [refinement, setRefinement] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isCheckoutRedirecting, setIsCheckoutRedirecting] = useState(false);

  const selectedStyle = useMemo(
    () => styleOptions.find((option) => option.id === style) ?? styleOptions[0],
    [style]
  );
  const selectedImage = useMemo(
    () => images.find((image) => image.id === selectedImageId) ?? images[0] ?? null,
    [images, selectedImageId]
  );
  const selectedImageIndex = selectedImage ? images.findIndex((image) => image.id === selectedImage.id) : -1;
  const isProfilePhotoPaid = project?.status === "paid";
  const statusCopy = getStatusCopy(isProfilePhotoPaid, bundleIncluded);

  useEffect(() => {
    track("profile_photo_tool_view", { page_path: pagePath });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProject() {
      const params = new URLSearchParams(window.location.search);
      const projectId = params.get("project");
      const statusUrl = projectId ? `/api/profile-photo?projectId=${encodeURIComponent(projectId)}` : "/api/profile-photo";

      try {
        const response = await fetch(statusUrl);
        if (response.status === 401) {
          if (!isMounted) return;
          setAuthStatus("anonymous");
          return;
        }

        const payload = (await response.json()) as ProfilePhotoStatusResponse;
        if (!isMounted) return;

        setAuthStatus(payload.authenticated ? "authenticated" : "anonymous");
        setBundleIncluded(Boolean(payload.bundleIncluded));
        setProject(payload.project ?? null);
        const savedImages = normalizeGeneratedImages(payload.project?.images ?? [], payload.project?.id);
        setImages(savedImages);
        setSelectedImageId(savedImages[0]?.id ?? null);
      } catch {
        if (!isMounted) return;
        setAuthStatus("anonymous");
      }
    }

    loadProject();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (files.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    setImages([]);
    setSelectedImageId(null);
    setRefinement("");
    setError(null);

    if (selectedFiles.length === 0) {
      setFiles([]);
      return;
    }
    if (selectedFiles.length > maxFiles) {
      setFiles([]);
      setError(`Upload maximaal ${maxFiles} foto's.`);
      return;
    }
    const invalidFile = selectedFiles.find((nextFile) => !allowedTypes.includes(nextFile.type));
    if (invalidFile) {
      setFiles([]);
      setError("Gebruik alleen JPG, PNG of WebP-afbeeldingen.");
      return;
    }
    const oversizedFile = selectedFiles.find((nextFile) => nextFile.size > maxFileSize);
    if (oversizedFile) {
      setFiles([]);
      setError("Eén van je foto's is te groot. Upload maximaal 8 MB per foto.");
      return;
    }
    const totalSize = selectedFiles.reduce((sum, nextFile) => sum + nextFile.size, 0);
    if (totalSize > maxTotalSize) {
      setFiles([]);
      setError("Je foto's zijn samen te groot. Upload maximaal 24 MB totaal.");
      return;
    }
    setFiles(selectedFiles);
  }

  async function generatePhoto() {
    if ((project?.generationCount ?? 0) >= 1) {
      setError("Je eerste set profielfoto's is al gemaakt. Gebruik verfijnen voor kleine aanpassingen.");
      return;
    }
    if (files.length === 0) {
      setError("Upload eerst minimaal één foto van jezelf.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setImages([]);
    track("profile_photo_submit", { page_path: pagePath, style });

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("photos", file));
      if (project?.id) formData.append("projectId", project.id);
      formData.append("style", style);

      const response = await fetch("/api/profile-photo", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        images?: GeneratedImage[];
        project?: ProfilePhotoProject;
        error?: string;
      };

      if (!response.ok || !payload.images?.length) {
        throw new Error(payload.error ?? "De profielfoto kon niet worden gemaakt.");
      }

      const responseProjectId = payload.project?.id ?? project?.id;
      const normalizedImages = normalizeGeneratedImages(payload.images, responseProjectId);
      setImages(normalizedImages);
      setSelectedImageId(normalizedImages[0]?.id ?? null);
      if (payload.project) {
        setProject((currentProject) =>
          currentProject ? { ...currentProject, ...payload.project, images: normalizedImages } : payload.project ?? null
        );
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Er ging iets mis.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function refinePhoto() {
    if (!project) {
      setError("Maak eerst je eerste set profielfoto's.");
      return;
    }
    if (project.refinementsRemaining <= 0) {
      setError("Je hebt de 2 inbegrepen verfijningen gebruikt.");
      return;
    }
    if (!selectedImage?.url) {
      setError("Kies eerst één gegenereerde foto om aan te passen.");
      return;
    }
    if (refinement.trim().length < 3) {
      setError("Beschrijf kort wat je wilt aanpassen.");
      return;
    }

    setIsRefining(true);
    setError(null);

    try {
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("mode", "refine");
      formData.append("projectId", project.id);
      formData.append("style", style);
      formData.append("refinement", refinement.trim());
      formData.append("photos", new File([blob], "selected-profile-photo.jpg", { type: "image/jpeg" }));

      const apiResponse = await fetch("/api/profile-photo", {
        method: "POST",
        body: formData,
      });

      const payload = (await apiResponse.json()) as {
        images?: GeneratedImage[];
        project?: ProfilePhotoProject;
        error?: string;
      };

      if (!apiResponse.ok || !payload.images?.length) {
        throw new Error(payload.error ?? "De aangepaste profielfoto kon niet worden gemaakt.");
      }

      const normalizedImages = normalizeGeneratedImages(payload.images, payload.project?.id ?? project.id);
      setImages((currentImages) => [...normalizedImages, ...currentImages]);
      setSelectedImageId(normalizedImages[0]?.id ?? selectedImage.id);
      if (payload.project) {
        setProject((currentProject) =>
          currentProject
            ? { ...currentProject, ...payload.project, images: [...normalizedImages, ...(currentProject.images ?? [])] }
            : payload.project ?? null
        );
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Er ging iets mis.");
    } finally {
      setIsRefining(false);
    }
  }

  function getDownloadUrl(image: GeneratedImage): string {
    if (!image.url) return "#";
    return image.url.includes("?") ? `${image.url}&download=1` : `${image.url}?download=1`;
  }

  async function startCheckout() {
    if (bundleIncluded) {
      setError("Je download zit in je bundle. Vernieuw de pagina als de downloadknop nog niet zichtbaar is.");
      return;
    }
    if (!project?.id || images.length === 0) {
      setError("Maak eerst je profielfoto-varianten. Je betaalt pas bij downloaden.");
      return;
    }

    setIsCheckoutRedirecting(true);
    setError(null);

    try {
      const response = await fetch("/api/profile-photo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (response.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent(pageAnchorPath)}`;
        return;
      }
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Checkout kon niet worden gestart.");
      }
      window.location.href = payload.url;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Checkout kon niet worden gestart.");
      setIsCheckoutRedirecting(false);
    }
  }

  if (authStatus === "loading") {
    return <div className="rounded-3xl border-2 border-slate-200 bg-[#FFFEF9] p-6 text-sm font-black text-slate-700">Accountstatus laden...</div>;
  }

  if (authStatus === "anonymous") {
    return (
      <div className="rounded-3xl border-2 border-black bg-[#FFFEF9] p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Account nodig</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Log in om je profielfoto te maken</h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
          Net als je cv bewaren we je betaalde output in je WerkCV-account, zodat je je profielfoto later opnieuw kunt downloaden.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={`/login?next=${encodeURIComponent(pageAnchorPath)}`} className="inline-flex justify-center rounded-full bg-black px-5 py-3 text-sm font-black text-white">
            Log in
          </Link>
          <Link href="/cv-maken-gratis" className="inline-flex justify-center rounded-full border-2 border-black bg-white px-5 py-3 text-sm font-black text-black">
            Eerst je cv maken
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:p-6">
      <div className="rounded-3xl border-2 border-black bg-[#E9FFFC] p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Status</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">{statusCopy.title}</h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">{statusCopy.description}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-slate-200 bg-[#FFFEF9] p-5">
            <h3 className="text-lg font-black text-slate-900">1. Upload je foto</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
              Gebruik een duidelijke selfie of portret. Upload maximaal 4 foto's als referentie.
            </p>
            <label className="mt-4 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-white p-5 text-center">
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} className="hidden" />
              <span className="rounded-full bg-black px-4 py-2 text-sm font-black text-white">Kies foto's</span>
            </label>
            {files.length > 0 && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Gekozen foto's ({files.length}/{maxFiles})
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}`} className="flex items-center gap-3">
                      {previewUrls[index] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrls[index]} alt={`Preview van geüploade profielfoto ${index + 1}`} className="h-20 w-20 rounded-2xl object-cover" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">{file.name}</p>
                        <p className="text-xs font-medium text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border-2 border-slate-200 bg-[#FFFEF9] p-5">
            <h3 className="text-lg font-black text-slate-900">2. Kies uitstraling</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {styleOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setStyle(option.id)}
                  className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                    style === option.id ? "border-black bg-[#4ECDC4] text-black" : "border-slate-200 bg-white text-slate-700 hover:border-black"
                  }`}
                >
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className="mt-1 block text-xs font-medium leading-relaxed">{option.description}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={generatePhoto}
              disabled={isGenerating}
              className="mt-5 w-full border-4 border-black bg-[#FFD166] px-5 py-4 text-base font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "Profielfoto's worden gemaakt..." : "Maak 4 professionele varianten"}
            </button>
            <p className="mt-3 text-xs font-medium leading-relaxed text-slate-500">
              {bundleIncluded
                ? "Downloaden zit al in je bundle. Maak je varianten en kies je favoriet."
                : `Voorbeelden maken kan na login. Downloaden kost éénmalig ${profilePhotoPrice.display}. Geen abonnement.`}
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Output</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Professionele varianten</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">
                {images.length === 0
                  ? "Upload een duidelijke foto, kies een stijl en maak vier varianten die je kunt testen voor cv en LinkedIn."
                  : "Kies één favoriet. Daarna kun je die foto verfijnen, downloaden of gebruiken bij je cv."}
              </p>
            </div>
            <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-600">
              {selectedStyle.label}
            </span>
          </div>

          {images.length === 0 ? (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {demoSamples.map((sample) => (
                  <figure key={sample.src} className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-[#FFFEF9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sample.src} alt={sample.alt} className="aspect-square w-full object-cover" />
                    <figcaption className="border-t border-slate-200 bg-white px-2 py-2 text-center text-[11px] font-black text-slate-700">
                      {sample.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-4 text-center text-xs font-bold leading-relaxed text-slate-500">
                Voorbeelden zijn AI-demo&apos;s. Jouw output wordt gemaakt op basis van je eigen upload.
              </p>
            </>
          ) : (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {images.map((image, index) => {
                  const isSelected = selectedImage?.id === image.id;
                  return (
                    <button
                      key={`${image.id}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageId(image.id)}
                      className={`group rounded-3xl border-2 bg-white p-3 text-left transition-transform hover:-translate-y-0.5 ${
                        isSelected ? "border-[#4ECDC4] ring-4 ring-[#4ECDC4]/30" : "border-slate-200 hover:border-black"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.url ?? ""} alt={`Gegenereerde profielfoto variant ${index + 1}`} className="aspect-square w-full rounded-2xl object-cover" />
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-900">Variant {index + 1}</span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-black ${isSelected ? "bg-[#4ECDC4] text-black" : "bg-slate-100 text-slate-500"}`}>
                          {isSelected ? "Gekozen" : "Kies"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedImage && (
                <div className="mt-6 space-y-4 rounded-3xl border-2 border-black bg-white p-5">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Gebruik variant {selectedImageIndex + 1}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                      Deze keuze gebruik je voor downloaden en verfijnen. Je kunt altijd eerst een andere variant selecteren voordat je betaalt.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {project?.status === "paid" ? (
                      <a href={getDownloadUrl(selectedImage)} download={`werkcv-profielfoto-${selectedImageIndex + 1}.jpg`} className="inline-flex justify-center rounded-full bg-black px-5 py-3 text-sm font-black text-white">
                        Download geselecteerde foto
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={startCheckout}
                        disabled={isCheckoutRedirecting}
                        className="inline-flex justify-center rounded-full bg-black px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isCheckoutRedirecting
                          ? "Checkout openen..."
                          : bundleIncluded
                            ? "Download zit in je bundle"
                            : `Betaal ${profilePhotoPrice.display} en download`}
                      </button>
                    )}
                    <Link href={editorPath} className="inline-flex justify-center rounded-full border-2 border-black bg-[#4ECDC4] px-5 py-3 text-sm font-black text-black">
                      Maak cv met deze foto
                    </Link>
                  </div>

                  <div className="rounded-3xl border-2 border-slate-200 bg-[#FFFEF9] p-5">
                    <h3 className="text-lg font-black text-slate-900">Wil je deze foto aanpassen?</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                      Beschrijf alleen wat anders moet. Je hebt nog {project?.refinementsRemaining ?? 2} verfijningen over.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {refinementSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setRefinement(suggestion)}
                          className="rounded-full border-2 border-black bg-white px-3 py-2 text-xs font-black text-black hover:bg-[#E9FFFC]"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    <label className="mt-4 block">
                      <span className="text-sm font-black text-slate-900">Aanpassing</span>
                      <textarea
                        value={refinement}
                        onChange={(event) => setRefinement(event.target.value.slice(0, 300))}
                        rows={3}
                        placeholder="Bijvoorbeeld: casual kleding, lichtere achtergrond, iets vriendelijker..."
                        className="mt-2 w-full rounded-2xl border-2 border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 outline-none focus:border-black"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={refinePhoto}
                      disabled={isRefining || !selectedImage || (project?.refinementsRemaining ?? 0) <= 0}
                      className="mt-4 inline-flex items-center justify-center border-2 border-black bg-[#FFD166] px-4 py-3 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRefining ? "Aangepaste variant maken..." : "Maak aangepaste variant"}
                    </button>
                  </div>

                  <div className="rounded-3xl border-2 border-black bg-[#FFFEF9] p-5">
                    <h3 className="text-lg font-black text-slate-900">Gebruik deze foto direct op een sterk cv</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                      Je profielfoto is maar één deel van je eerste indruk. Zet hem naast een nette template en download pas wanneer je cv klaar is.
                    </p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Link href={editorPath} className="inline-flex flex-1 items-center justify-center border-2 border-black bg-[#4ECDC4] px-4 py-3 text-sm font-black text-black">
                        Maak mijn cv met deze foto
                      </Link>
                      <Link href={templatesPath} className="inline-flex flex-1 items-center justify-center border-2 border-black bg-white px-4 py-3 text-sm font-black text-black">
                        Bekijk templates
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
