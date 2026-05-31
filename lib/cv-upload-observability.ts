import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";

type UiLocale = "nl" | "en";

type RecordCvParseFailureInput = {
  route: string;
  stage: string;
  userId?: string | null;
  file?: File | null;
  error: unknown;
};

function getErrorName(error: unknown): string {
  if (error instanceof Error && error.name) return error.name;
  if (typeof error === "object" && error !== null) return "object";
  return typeof error;
}

export function getCvParseInternalMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues
      .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
      .join(" | ")
      .slice(0, 1000);
  }

  if (error instanceof Error && error.message) {
    return error.message.slice(0, 1000);
  }

  try {
    return JSON.stringify(error).slice(0, 1000);
  } catch {
    return String(error).slice(0, 1000);
  }
}

function isUnreadableTextError(message: string): boolean {
  return (
    message.includes("could not extract text from file") ||
    message.includes("could not extract text from input") ||
    message.includes("no readable text found")
  );
}

function isStructuredParseError(error: unknown, message: string): boolean {
  return (
    error instanceof SyntaxError ||
    error instanceof ZodError ||
    message.includes("json") ||
    message.includes("schema") ||
    message.includes("structured") ||
    message.includes("attribute") ||
    message.includes("required") ||
    message.includes("unexpected token") ||
    message.includes("failed to parse cv structure")
  );
}

export function getCvParsePublicMessage(error: unknown, locale: UiLocale = "nl"): string {
  const message = getCvParseInternalMessage(error).toLowerCase();

  if (isUnreadableTextError(message)) {
    return locale === "en"
      ? "We could not read usable text from this file. This often happens with scanned PDFs or image-based exports. Try a text-based PDF or Word file."
      : "We konden geen bruikbare tekst uit dit bestand halen. Dit gebeurt vaak bij gescande PDF's of exports die vooral uit afbeeldingen bestaan. Probeer een tekst-PDF of Word-bestand.";
  }

  if (isStructuredParseError(error, message)) {
    return locale === "en"
      ? "We could read the file, but could not reliably turn it into CV fields. Try a cleaner PDF export or a Word version of the same CV."
      : "We konden het bestand wel lezen, maar niet betrouwbaar omzetten naar CV-velden. Probeer een schonere PDF-export of een Word-versie van hetzelfde CV.";
  }

  return locale === "en"
    ? "We could not process this CV right now. Try another export of the file and contact support if it keeps failing."
    : "We konden dit CV nu niet verwerken. Probeer een andere export van het bestand en neem contact op als het blijft misgaan.";
}

export async function recordCvParseFailure({
  route,
  stage,
  userId,
  file,
  error,
}: RecordCvParseFailureInput): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        event: "cv_parse_failed",
        path: route,
        properties: {
          route,
          stage,
          userId: userId || null,
          fileName: file?.name || null,
          fileType: file?.type || null,
          fileSize: typeof file?.size === "number" ? file.size : null,
          errorName: getErrorName(error),
          errorMessage: getCvParseInternalMessage(error),
        } as Prisma.InputJsonValue,
      },
    });
  } catch (persistError) {
    console.error("cv_parse_failed_event_persist_failed", persistError);
  }
}
