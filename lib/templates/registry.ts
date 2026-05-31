// Template Registry - All 12 CV Templates with their configurations

import { TemplateRegistry, sharedColorThemes, ColorTheme } from './index';

// Helper to pick themes from shared collection
const pickThemes = (...ids: string[]): ColorTheme[] => {
    return ids.map(id => sharedColorThemes[id]).filter(Boolean);
};

export const templateRegistry: TemplateRegistry = {
    // ============================================
    // CLASSIC CATEGORY
    // ============================================
    'professional': {
        id: 'professional',
        name: 'Professional',
        nameDutch: 'Professioneel',
        description: 'Strak, helder en zeer modern. Perfect voor zakelijke functies.',
        category: 'classic',
        layout: 'two-column-left',
        colorThemes: pickThemes(
            'classic-blue',
            'elegant-navy',
            'charcoal',
            'modern-teal',
            'sage-green',
            'burgundy'
        ),
        defaultThemeId: 'classic-blue',
    },

    'classical': {
        id: 'classical',
        name: 'Classical',
        nameDutch: 'Klassiek',
        description: 'Elegant en volwassen. Tijdloze uitstraling voor ervaren professionals.',
        category: 'classic',
        layout: 'single-column',
        colorThemes: pickThemes(
            'charcoal',
            'elegant-navy',
            'warm-earth',
            'sage-green',
            'burgundy',
            'slate-modern'
        ),
        defaultThemeId: 'charcoal',
    },

    'formal': {
        id: 'formal',
        name: 'Formal',
        nameDutch: 'Formeel',
        description: 'Stijlvol en modern. Ideaal voor management en consultancy posities.',
        category: 'classic',
        layout: 'two-column-right',
        colorThemes: pickThemes(
            'elegant-navy',
            'classic-blue',
            'charcoal',
            'purple-royal',
            'ocean-blue',
            'forest-green'
        ),
        defaultThemeId: 'elegant-navy',
    },

    // ============================================
    // MODERN CATEGORY
    // ============================================
    'modern': {
        id: 'modern',
        name: 'Modern',
        nameDutch: 'Modern',
        description: 'Krachtig, strak en professioneel. Voor de hedendaagse professional.',
        category: 'modern',
        layout: 'two-column-left',
        colorThemes: pickThemes(
            'ocean-blue',
            'modern-teal',
            'purple-royal',
            'rose-gold',
            'forest-green',
            'slate-modern'
        ),
        defaultThemeId: 'ocean-blue',
    },

    'dynamic': {
        id: 'dynamic',
        name: 'Dynamic',
        nameDutch: 'Dynamisch',
        description: 'Krachtig en stijlvol. Maak indruk met een opvallend ontwerp.',
        category: 'modern',
        layout: 'two-column-left',
        colorThemes: pickThemes(
            'purple-royal',
            'classic-blue',
            'modern-teal',
            'burgundy',
            'ocean-blue',
            'rose-gold'
        ),
        defaultThemeId: 'purple-royal',
    },

    'jobboss': {
        id: 'jobboss',
        name: 'Job Application Boss',
        nameDutch: 'Sollicitatiebaas',
        description: 'Jong, fris en kleurrijk. Perfect voor starters en creatievelingen.',
        category: 'modern',
        layout: 'two-column-right',
        colorThemes: pickThemes(
            'modern-teal',
            'ocean-blue',
            'purple-royal',
            'rose-gold',
            'forest-green',
            'classic-blue'
        ),
        defaultThemeId: 'modern-teal',
    },

    // ============================================
    // CREATIVE CATEGORY
    // ============================================
    'elegant': {
        id: 'elegant',
        name: 'Elegant',
        nameDutch: 'Elegant',
        description: 'Solide en professioneel. Een verfijnde keuze voor elke sector.',
        category: 'creative',
        layout: 'two-column-right',
        colorThemes: pickThemes(
            'elegant-navy',
            'burgundy',
            'charcoal',
            'purple-royal',
            'warm-earth',
            'sage-green'
        ),
        defaultThemeId: 'elegant-navy',
    },

    'remarkable': {
        id: 'remarkable',
        name: 'Remarkable',
        nameDutch: 'Opmerkelijk',
        description: 'Fris en kleurrijk, opvallend. Trek de aandacht van recruiters.',
        category: 'creative',
        layout: 'two-column-left',
        colorThemes: pickThemes(
            'rose-gold',
            'modern-teal',
            'purple-royal',
            'ocean-blue',
            'forest-green',
            'burgundy'
        ),
        defaultThemeId: 'rose-gold',
    },

    'sepia': {
        id: 'sepia',
        name: 'Sepia',
        nameDutch: 'Sepia',
        description: 'Creatief, prachtig georganiseerd en stijlvol. Warme uitstraling.',
        category: 'creative',
        layout: 'two-column-left',
        colorThemes: pickThemes(
            'warm-earth',
            'burgundy',
            'sage-green',
            'charcoal',
            'elegant-navy',
            'forest-green'
        ),
        defaultThemeId: 'warm-earth',
    },

    // ============================================
    // MINIMAL CATEGORY
    // ============================================
    'simple': {
        id: 'simple',
        name: 'Simple',
        nameDutch: 'Simpel',
        description: 'Strak en zonder poespas. Laat je ervaring spreken.',
        category: 'minimal',
        layout: 'single-column',
        colorThemes: pickThemes(
            'charcoal',
            'slate-modern',
            'classic-blue',
            'elegant-navy',
            'sage-green',
            'modern-teal'
        ),
        defaultThemeId: 'charcoal',
    },

    'robust': {
        id: 'robust',
        name: 'Robust',
        nameDutch: 'Robuust',
        description: 'Sprekend, krachtig en helder. Voor wie veel te vertellen heeft.',
        category: 'minimal',
        layout: 'two-column-left',
        colorThemes: pickThemes(
            'ocean-blue',
            'classic-blue',
            'charcoal',
            'modern-teal',
            'forest-green',
            'elegant-navy'
        ),
        defaultThemeId: 'ocean-blue',
    },

    'monochrome': {
        id: 'monochrome',
        name: 'Monochrome',
        nameDutch: 'Monochroom',
        description: 'Netjes, helder en expressief. Typografie-gefocust ontwerp.',
        category: 'minimal',
        layout: 'single-column',
        colorThemes: pickThemes(
            'charcoal',
            'slate-modern',
            'elegant-navy',
            'classic-blue',
            'warm-earth',
            'sage-green'
        ),
        defaultThemeId: 'charcoal',
    },

    // ============================================
    // ATS-OPTIMIZED
    // ============================================
    'ats': {
        id: 'ats',
        name: 'ATS-Friendly',
        nameDutch: 'ATS-Vriendelijk',
        description: 'Geoptimaliseerd voor Applicant Tracking Systems. Eenvoudig, geen grafische elementen, alle keywords behouden.',
        category: 'minimal',
        layout: 'single-column',
        colorThemes: pickThemes(
            'charcoal',
            'classic-blue',
            'elegant-navy',
            'slate-modern',
            'forest-green',
            'modern-teal'
        ),
        defaultThemeId: 'charcoal',
    },
};

// Export template list for gallery
export const templateList = Object.values(templateRegistry);

// Export by category for filtered views
export const templatesByCategory = {
    classic: templateList.filter(t => t.category === 'classic'),
    modern: templateList.filter(t => t.category === 'modern'),
    creative: templateList.filter(t => t.category === 'creative'),
    minimal: templateList.filter(t => t.category === 'minimal'),
};

// Get template config by ID
export function getTemplateConfig(templateId: string) {
    return templateRegistry[templateId] ?? templateRegistry['professional'];
}

// Get default theme ID for a template
export function getDefaultThemeId(templateId: string): string {
    const config = getTemplateConfig(templateId);
    return config.defaultThemeId;
}

// Get a color theme by ID from the shared themes
export function getThemeById(themeId: string): ColorTheme {
    return sharedColorThemes[themeId] ?? sharedColorThemes['classic-blue'];
}
