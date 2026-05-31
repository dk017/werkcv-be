import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildProfilePhotoCheckoutURL } from "@/lib/polar";
import { profilePhotoPrice } from "@/lib/site-content";
import { reportOpsIncident } from "@/lib/ops-alerts";

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as { projectId?: string };
  const projectId = typeof body.projectId === "string" ? body.projectId : "";

  if (!projectId) {
    return NextResponse.json({ error: "PROJECT_REQUIRED" }, { status: 400 });
  }

  const project = await prisma.profilePhotoProject.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "PROJECT_NOT_FOUND" }, { status: 404 });
  }

  if (project.status === "paid") {
    return NextResponse.json({ error: "ALREADY_PAID" }, { status: 409 });
  }

  if (project.generationCount < 1) {
    return NextResponse.json({ error: "GENERATE_FIRST" }, { status: 400 });
  }

  try {
    const url = await buildProfilePhotoCheckoutURL(project.id, user.email);

    await prisma.analyticsEvent.create({
      data: {
        event: "profile_photo_checkout_started",
        path: "/profielfoto-cv-maken",
        properties: {
          projectId: project.id,
          product: "profile-photo",
          amountCents: profilePhotoPrice.amountCents,
          currency: profilePhotoPrice.currency,
        } as Prisma.InputJsonValue,
        attribution: (user.attribution || undefined) as Prisma.InputJsonValue | undefined,
      },
    });

    return NextResponse.json({ url, projectId: project.id });
  } catch (error) {
    await reportOpsIncident({
      event: "ops_checkout_create_failed",
      route: "/api/profile-photo/checkout",
      stage: "polar_profile_photo_checkout_create",
      error,
      userId: user.id,
      userEmail: user.email,
      notifyUser: true,
      context: {
        projectId: project.id,
        product: "profile-photo",
      },
    });

    return NextResponse.json(
      { error: "CHECKOUT_FAILED" },
      { status: 500 }
    );
  }
}
