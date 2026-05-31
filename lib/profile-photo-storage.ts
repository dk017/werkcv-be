import { promises as fs } from "fs";
import path from "path";

export type StoredProfilePhotoImage = {
  id: string;
  filename: string;
  kind: "generated" | "refined";
  style: string;
  createdAt: string;
  refinement?: string;
};

const defaultStorageRoot = path.join(process.cwd(), "local", "profile-photos");
const mountedStorageRoot = path.join(process.cwd(), "storage", "profile-photos");
const dockerMountedStorageRoot = "/app/storage/profile-photos";

function getPrimaryStorageRoot(): string {
  return process.env.PROFILE_PHOTO_STORAGE_DIR || defaultStorageRoot;
}

function getReadStorageRoots(): string[] {
  return Array.from(
    new Set(
      [
        getPrimaryStorageRoot(),
        dockerMountedStorageRoot,
        mountedStorageRoot,
        defaultStorageRoot,
      ]
    )
  );
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 120);
}

function safeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 160);
}

export function getProfilePhotoStoragePath(userId: string, projectId: string, filename: string): string {
  return path.join(getPrimaryStorageRoot(), safeSegment(userId), safeSegment(projectId), safeFilename(filename));
}

export async function saveProfilePhotoImage(params: {
  userId: string;
  projectId: string;
  imageId: string;
  base64: string;
}): Promise<string> {
  const directory = path.join(getPrimaryStorageRoot(), safeSegment(params.userId), safeSegment(params.projectId));
  await fs.mkdir(directory, { recursive: true });

  const filename = `${safeSegment(params.imageId)}.jpg`;
  await fs.writeFile(path.join(directory, filename), Buffer.from(params.base64, "base64"));
  return filename;
}

export async function readProfilePhotoImage(params: {
  userId: string;
  projectId: string;
  filename: string;
}): Promise<Buffer> {
  const relativeSegments = [
    safeSegment(params.userId),
    safeSegment(params.projectId),
    safeFilename(params.filename),
  ];

  const attemptedPaths = getReadStorageRoots().map((root) => path.join(root, ...relativeSegments));

  for (const fullPath of attemptedPaths) {
    try {
      return await fs.readFile(fullPath);
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? error.code : null;
      if (code !== "ENOENT") {
        throw error;
      }
    }
  }

  throw new Error(`Profile photo file not found. Attempted paths: ${attemptedPaths.join(", ")}`);
}
