import { z } from "zod";

export const b2bLeadPageSchema = z.enum(["agency", "coach", "partner"]);

export type B2BLeadPage = z.infer<typeof b2bLeadPageSchema>;

export const b2bLeadPayloadSchema = z.object({
  pageType: b2bLeadPageSchema,
  pagePath: z.string().trim().min(1).max(120),
  name: z.string().trim().min(2).max(80),
  workEmail: z.string().trim().email().max(120),
  organization: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(80),
  audienceType: z.string().trim().min(2).max(100),
  monthlyVolume: z.string().trim().min(1).max(60),
  timeline: z.string().trim().min(1).max(60),
  goal: z.string().trim().min(12).max(1200),
  notes: z.string().trim().max(1200).optional().default(""),
  website: z.string().trim().max(0).optional().default(""),
  attribution: z.unknown().optional(),
});

export type B2BLeadPayload = z.infer<typeof b2bLeadPayloadSchema>;

const PAGE_LABELS: Record<B2BLeadPage, string> = {
  agency: "Agency pilot",
  coach: "Coach samenwerking",
  partner: "Partner samenwerking",
};

export function getB2BLeadPageLabel(pageType: B2BLeadPage): string {
  return PAGE_LABELS[pageType];
}
