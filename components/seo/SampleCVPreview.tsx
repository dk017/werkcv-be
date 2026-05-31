'use client';
/* eslint-disable react-hooks/static-components */

import { CVData } from '@/lib/cv';
import { getTemplateComponent } from '@/app/editor/templates';
import { getThemeById } from '@/lib/templates/registry';
import { LinkTextProvider } from '@/app/editor/templates/link-utils';

interface SampleCVPreviewProps {
    data: CVData;
    templateId?: string;
    colorThemeId?: string;
    scale?: number;
}

export function SampleCVPreview({
    data,
    templateId = 'professional',
    colorThemeId = 'classic-blue',
    scale = 0.5,
    maxHeight = 500,
}: SampleCVPreviewProps & { maxHeight?: number }) {
    const TemplateComponent = getTemplateComponent(templateId);
    const theme = getThemeById(colorThemeId);

    return (
        <div
            className="relative overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white"
            style={{ maxHeight: `${maxHeight}px` }}
        >
            {/* Scale container */}
            <div
                className="origin-top-left"
                style={{
                    transform: `scale(${scale})`,
                    width: `${100 / scale}%`,
                }}
            >
                <div className="pointer-events-none">
                    <LinkTextProvider disableAnchors>
                        <TemplateComponent data={data} theme={theme} nameTag="div" />
                    </LinkTextProvider>
                </div>
            </div>

            {/* Fade-out gradient at bottom for visual cut-off effect */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
        </div>
    );
}

// Smaller preview for cards
export function SampleCVPreviewSmall({
    data,
    templateId = 'professional',
    colorThemeId = 'classic-blue',
}: Omit<SampleCVPreviewProps, 'scale'>) {
    return (
        <SampleCVPreview
            data={data}
            templateId={templateId}
            colorThemeId={colorThemeId}
            scale={0.35}
        />
    );
}

// Medium preview for featured sections
export function SampleCVPreviewMedium({
    data,
    templateId = 'professional',
    colorThemeId = 'classic-blue',
}: Omit<SampleCVPreviewProps, 'scale'>) {
    return (
        <SampleCVPreview
            data={data}
            templateId={templateId}
            colorThemeId={colorThemeId}
            scale={0.5}
        />
    );
}
