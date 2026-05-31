import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/cv-parser";
import { CvScoreInputError, scoreCv } from "@/lib/tools/cv-score";
import { checkRateLimit, getClientIp } from "@/lib/tools/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TEXT_LENGTH = 25_000;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "",
]);
const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip, {
    bucket: "cv-score",
    maxRequests: 8,
    windowMs: 60 * 60 * 1000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Te veel analyses vanaf dit IP-adres. Probeer het over een uur opnieuw." },
      { status: 429 }
    );
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Geen bestand geüpload." }, { status: 400 });
      }

      const extension = file.name.toLowerCase().split(".").pop() ?? "";
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return NextResponse.json(
          { error: "Alleen PDF- of Word-bestanden zijn toegestaan." },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "Bestandstype niet ondersteund. Upload een PDF of Word-bestand." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Bestand is te groot. Maximaal 5 MB toegestaan." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const extractedText = (await extractTextFromFile(buffer, file.name)).trim();
      const result = await scoreCv(extractedText.slice(0, MAX_TEXT_LENGTH), {
        mode: "file",
        fileName: file.name,
      });

      return NextResponse.json(result);
    }

    const body = await request.json();
    const rawText =
      typeof body?.text === "string"
        ? body.text
        : typeof body?.cvText === "string"
          ? body.cvText
          : "";
    const text = rawText.trim().slice(0, MAX_TEXT_LENGTH);

    const result = await scoreCv(text, { mode: "text" });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof CvScoreInputError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof Error && /Unsupported file type/i.test(error.message)) {
      return NextResponse.json(
        { error: "Alleen PDF- of Word-bestanden zijn toegestaan." },
        { status: 400 }
      );
    }

    console.error("cv-score route error:", error);
    return NextResponse.json(
      { error: "Analyse mislukt. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
