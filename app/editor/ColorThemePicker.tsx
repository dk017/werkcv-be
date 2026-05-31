"use client";

import { getTemplateConfig } from '@/lib/templates/registry';

interface ColorThemePickerProps {
    templateId: string;
    currentThemeId: string;
    onSelectTheme: (themeId: string) => void;
}

export default function ColorThemePicker({
    templateId,
    currentThemeId,
    onSelectTheme,
}: ColorThemePickerProps) {
    const template = getTemplateConfig(templateId);
    const themes = template?.colorThemes || [];

    return (
        <div className="flex items-center gap-1.5">
            {themes.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`w-6 h-6 rounded-full transition-all ${
                        currentThemeId === theme.id
                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                            : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: theme.primary }}
                    title={theme.name}
                />
            ))}
        </div>
    );
}
