// Template System Types and Utilities

export interface ColorTheme {
    id: string;
    name: string;           // Dutch name for UI
    primary: string;        // Main accent color (headers, highlights)
    secondary: string;      // Secondary accent
    text: string;           // Main text color
    textMuted: string;      // Secondary/muted text
    background: string;     // Page background
    border: string;         // Border colors
    headerBg?: string;      // Optional header background
}

export interface TemplateConfig {
    id: string;
    name: string;           // English name
    nameDutch: string;      // Dutch name for UI
    description: string;    // Dutch description for gallery
    category: 'classic' | 'modern' | 'creative' | 'minimal';
    layout: 'single-column' | 'two-column-left' | 'two-column-right';
    colorThemes: ColorTheme[];
    defaultThemeId: string;
}

export interface TemplateRegistry {
    [templateId: string]: TemplateConfig;
}

// Helper function to get a specific theme from a template
export function getThemeForTemplate(
    registry: TemplateRegistry,
    templateId: string,
    colorThemeId: string
): ColorTheme {
    const template = registry[templateId];
    if (!template) {
        // Fallback to first template's first theme
        const firstTemplate = Object.values(registry)[0];
        return firstTemplate?.colorThemes[0] ?? defaultTheme;
    }

    const theme = template.colorThemes.find(t => t.id === colorThemeId);
    return theme ?? template.colorThemes[0] ?? defaultTheme;
}

// Default fallback theme
export const defaultTheme: ColorTheme = {
    id: 'classic-blue',
    name: 'Klassiek Blauw',
    primary: '#1e40af',
    secondary: '#3b82f6',
    text: '#111827',
    textMuted: '#6b7280',
    background: '#ffffff',
    border: '#e5e7eb',
};

// Shared color themes that can be reused across templates
export const sharedColorThemes: Record<string, ColorTheme> = {
    'classic-blue': {
        id: 'classic-blue',
        name: 'Klassiek Blauw',
        primary: '#1e40af',
        secondary: '#3b82f6',
        text: '#111827',
        textMuted: '#6b7280',
        background: '#ffffff',
        border: '#e5e7eb',
    },
    'elegant-navy': {
        id: 'elegant-navy',
        name: 'Elegant Navy',
        primary: '#1e3a5f',
        secondary: '#2563eb',
        text: '#1f2937',
        textMuted: '#4b5563',
        background: '#ffffff',
        border: '#d1d5db',
    },
    'modern-teal': {
        id: 'modern-teal',
        name: 'Modern Teal',
        primary: '#0d9488',
        secondary: '#14b8a6',
        text: '#134e4a',
        textMuted: '#5b7a78',
        background: '#ffffff',
        border: '#d1d5db',
    },
    'warm-earth': {
        id: 'warm-earth',
        name: 'Warme Aarde',
        primary: '#92400e',
        secondary: '#d97706',
        text: '#1c1917',
        textMuted: '#57534e',
        background: '#ffffff',
        border: '#d6d3d1',
    },
    'charcoal': {
        id: 'charcoal',
        name: 'Houtskool',
        primary: '#374151',
        secondary: '#6b7280',
        text: '#111827',
        textMuted: '#6b7280',
        background: '#ffffff',
        border: '#e5e7eb',
    },
    'sage-green': {
        id: 'sage-green',
        name: 'Salie Groen',
        primary: '#4d7c0f',
        secondary: '#65a30d',
        text: '#1a2e05',
        textMuted: '#4b5563',
        background: '#ffffff',
        border: '#d1d5db',
    },
    'burgundy': {
        id: 'burgundy',
        name: 'Bordeaux',
        primary: '#7f1d1d',
        secondary: '#b91c1c',
        text: '#1f2937',
        textMuted: '#6b7280',
        background: '#ffffff',
        border: '#e5e7eb',
    },
    'purple-royal': {
        id: 'purple-royal',
        name: 'Koninklijk Paars',
        primary: '#5b21b6',
        secondary: '#7c3aed',
        text: '#1f2937',
        textMuted: '#6b7280',
        background: '#ffffff',
        border: '#e5e7eb',
    },
    'ocean-blue': {
        id: 'ocean-blue',
        name: 'Oceaan Blauw',
        primary: '#0369a1',
        secondary: '#0ea5e9',
        text: '#0c4a6e',
        textMuted: '#64748b',
        background: '#ffffff',
        border: '#e2e8f0',
    },
    'forest-green': {
        id: 'forest-green',
        name: 'Bosgroen',
        primary: '#166534',
        secondary: '#22c55e',
        text: '#14532d',
        textMuted: '#6b7280',
        background: '#ffffff',
        border: '#d1d5db',
    },
    'slate-modern': {
        id: 'slate-modern',
        name: 'Modern Leisteen',
        primary: '#475569',
        secondary: '#64748b',
        text: '#1e293b',
        textMuted: '#64748b',
        background: '#ffffff',
        border: '#e2e8f0',
    },
    'rose-gold': {
        id: 'rose-gold',
        name: 'Roségoud',
        primary: '#be185d',
        secondary: '#ec4899',
        text: '#1f2937',
        textMuted: '#6b7280',
        background: '#ffffff',
        border: '#fce7f3',
    },
};
