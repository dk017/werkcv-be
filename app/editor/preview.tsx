"use client";
/* eslint-disable react-hooks/static-components */
import { useRef, useEffect, useCallback } from "react";
import { CVData } from "@/lib/cv";
import { getTemplateComponent, getTheme } from "./templates";

interface PreviewProps {
    data: CVData;
    templateId: string;
    colorThemeId: string;
    onPageCountChange?: (pageCount: number) => void;
}

export default function Preview({ data, templateId, colorThemeId, onPageCountChange }: PreviewProps) {
    const TemplateComponent = getTemplateComponent(templateId);
    const theme = getTheme(templateId, colorThemeId);
    const containerRef = useRef<HTMLDivElement>(null);
    // Cache A4 height in px — measured once, never changes during a session
    const a4HeightRef = useRef<number>(0);

    // Stable callback for ResizeObserver
    const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
        if (!onPageCountChange) return;

        // Measure A4 height once and cache it
        if (a4HeightRef.current === 0) {
            const tempDiv = document.createElement('div');
            tempDiv.style.height = '297mm';
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            document.body.appendChild(tempDiv);
            a4HeightRef.current = tempDiv.offsetHeight;
            document.body.removeChild(tempDiv);
        }

        for (const entry of entries) {
            const heightPx = entry.contentRect.height;
            const pages = Math.max(1, Math.ceil(heightPx / a4HeightRef.current));
            onPageCountChange(pages);
        }
    }, [onPageCountChange]);

    useEffect(() => {
        if (!containerRef.current || !onPageCountChange) return;

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [onPageCountChange, handleResize]);

    return (
        <div ref={containerRef}>
            <TemplateComponent data={data} theme={theme} />
        </div>
    );
}
