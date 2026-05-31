import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseCV } from '@/lib/cv-parser';
import { formatCvForDutch } from '@/lib/format-resume-dutch';
import { CVData } from '@/lib/cv';
import { sanitizeAttribution } from '@/lib/attribution';
import { Prisma } from '@prisma/client';
import { getCurrentUserFromRequest } from '@/lib/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported for this tool.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedCv = await parseCV(buffer, file.name);
    const translatedCv = await formatCvForDutch(parsedCv);

    const baseTitle = translatedCv.personal.name
      ? `Translated CV - ${translatedCv.personal.name}`
      : 'Translated CV';

    let cv;
    try {
      cv = await prisma.cVDocument.create({
        data: {
          title: baseTitle,
          data: translatedCv as CVData,
          templateId,
          colorThemeId,
          attribution: attribution as unknown as Prisma.InputJsonValue | undefined,
          sourceCluster: attribution?.firstTouchCluster || null,
          sourceLocale: attribution?.locale || null,
          startSource: 'resume_translate',
          userId: user.id,
        } as unknown as Prisma.CVDocumentCreateInput,
      });
    } catch (error) {
      console.error('Translate resume create failed, retrying simplified:', error);
      cv = await prisma.cVDocument.create({
        data: {
          title: baseTitle,
          data: translatedCv as CVData,
          templateId,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      cvId: cv.id,
      templateId: cv.templateId,
      colorThemeId: cv.colorThemeId,
      data: translatedCv,
    });
  } catch (error) {
    console.error('Translate resume error:', error);
    const message = error instanceof Error ? error.message : 'Failed to translate resume';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
