import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { extractTextFromPDF } from '@/lib/cv-parser';
import { formatCvForDutch } from '@/lib/format-resume-dutch';
import { CVData } from '@/lib/cv';
import { sanitizeAttribution } from '@/lib/attribution';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { parseLinkedInProfileText, repairLinkedInSummary } from '@/lib/linkedin-import';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_LENGTH = 50000;

function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const profileTextEntry = formData.get('profileText');
    const file = formData.get('file') as File | null;
    const attributionRaw = formData.get('attribution');
    const templateIdEntry = formData.get('templateId');
    const colorThemeEntry = formData.get('colorThemeId');

    let attribution = null;
    if (typeof attributionRaw === 'string') {
      try {
        attribution = sanitizeAttribution(JSON.parse(attributionRaw));
      } catch {
        attribution = null;
      }
    }

    const templateId =
      typeof templateIdEntry === 'string' && templateIdEntry.trim()
        ? templateIdEntry.trim()
        : 'professional';
    const colorThemeId =
      typeof colorThemeEntry === 'string' && colorThemeEntry.trim()
        ? colorThemeEntry.trim()
        : 'classic-blue';

    let rawText = '';
    let inputType: 'linkedin_text' | 'linkedin_pdf' = 'linkedin_text';

    if (typeof profileTextEntry === 'string' && profileTextEntry.trim()) {
      rawText = profileTextEntry.trim();
      if (rawText.length > MAX_TEXT_LENGTH) {
        return NextResponse.json(
          { error: 'Input is too long. Please paste a shorter profile excerpt.' },
          { status: 400 }
        );
      }
    } else if (file) {
      if (!isPdfFile(file)) {
        return NextResponse.json(
          { error: 'Only PDF exports are supported for this import.' },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 10MB.' },
          { status: 400 }
        );
      }

      rawText = await extractTextFromPDF(Buffer.from(await file.arrayBuffer()));
      inputType = 'linkedin_pdf';
    } else {
      return NextResponse.json(
        { error: 'Paste LinkedIn profile text or upload a LinkedIn PDF export.' },
        { status: 400 }
      );
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: 'No readable text found in the LinkedIn input.' },
        { status: 400 }
      );
    }

    const parsedCv = await parseLinkedInProfileText(rawText);
    const formattedCv = await formatCvForDutch(parsedCv);
    const finalizedCv = await repairLinkedInSummary(rawText, formattedCv);
    const documentLanguage = finalizedCv.personal.resumeLanguage === 'en' ? 'en' : 'nl';
    const baseTitle = finalizedCv.personal.name
      ? `LinkedIn import - ${finalizedCv.personal.name}`
      : 'LinkedIn import';

    let cv;
    try {
      cv = await prisma.cVDocument.create({
        data: {
          title: baseTitle,
          data: finalizedCv as CVData,
          templateId,
          colorThemeId,
          attribution: attribution as unknown as Prisma.InputJsonValue | undefined,
          sourceCluster: attribution?.firstTouchCluster || null,
          sourceLocale: attribution?.locale || null,
          startSource: inputType,
          userId: user.id,
        } as unknown as Prisma.CVDocumentCreateInput,
      });
    } catch (error) {
      console.error('LinkedIn import create failed, retrying simplified:', error);
      cv = await prisma.cVDocument.create({
        data: {
          title: baseTitle,
          data: finalizedCv as CVData,
          templateId,
          colorThemeId,
          userId: user.id,
        },
      });
    }

    const editorPath = `${documentLanguage === 'en' ? '/en/editor' : '/editor'}?id=${cv.id}`;

    return NextResponse.json({
      success: true,
      cvId: cv.id,
      editorPath,
      documentLanguage,
      templateId: cv.templateId,
      colorThemeId: cv.colorThemeId,
      data: finalizedCv,
    });
  } catch (error) {
    console.error('LinkedIn import error:', error);
    const message = error instanceof Error ? error.message : 'Failed to import LinkedIn profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
