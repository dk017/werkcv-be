import { prisma } from "@/lib/prisma";
import { CV_PROFILE_PHOTO_BUNDLE_PRODUCT } from "@/lib/polar";

type ClaimResult =
  | { claimed: true; orderId: string }
  | { claimed: false; reason: "already_paid" | "no_project" | "no_bundle_order" };

async function findAvailableBundleOrder(email: string) {
  const orders = await prisma.order.findMany({
    where: {
      email,
      product: CV_PROFILE_PHOTO_BUNDLE_PRODUCT,
      paidAt: { not: null },
    },
    orderBy: { paidAt: "desc" },
    take: 10,
    include: {
      profilePhotoProject: {
        select: { id: true },
      },
    },
  });

  return orders.find((order) => !order.profilePhotoProject) ?? null;
}

export async function hasAvailableProfilePhotoBundle(email: string): Promise<boolean> {
  return Boolean(await findAvailableBundleOrder(email));
}

export async function claimProfilePhotoBundle(email: string, projectId: string): Promise<ClaimResult> {
  const project = await prisma.profilePhotoProject.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      status: true,
      orderId: true,
    },
  });

  if (!project) return { claimed: false, reason: "no_project" };
  if (project.status === "paid" || project.orderId) return { claimed: false, reason: "already_paid" };

  const order = await findAvailableBundleOrder(email);
  if (!order) return { claimed: false, reason: "no_bundle_order" };

  await prisma.profilePhotoProject.update({
    where: { id: project.id },
    data: {
      status: "paid",
      orderId: order.id,
    },
  });

  return { claimed: true, orderId: order.id };
}
