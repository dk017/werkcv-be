// Template Component Registry
// Maps template IDs to their React components

import { ComponentType } from 'react';
import { CVData } from '@/lib/cv';
import { ColorTheme, getThemeForTemplate } from '@/lib/templates';
import { templateRegistry, getTemplateConfig } from '@/lib/templates/registry';

// Import all template components
import ProfessionalTemplate from './ProfessionalTemplate';
import DynamicTemplate from './DynamicTemplate';
import FormalTemplate from './FormalTemplate';
import ElegantTemplate from './ElegantTemplate';
import RemarkableTemplate from './RemarkableTemplate';
import ClassicalTemplate from './ClassicalTemplate';
import ModernTemplate from './ModernTemplate';
import SimpleTemplate from './SimpleTemplate';
import RobustTemplate from './RobustTemplate';
import SepiaTemplate from './SepiaTemplate';
import JobBossTemplate from './JobBossTemplate';
import MonochromeTemplate from './MonochromeTemplate';
import ATSTemplate from './ATSTemplate';

// Template component props interface
export interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Map of all template components
export const templateComponents: Record<string, ComponentType<TemplateProps>> = {
    'professional': ProfessionalTemplate,
    'dynamic': DynamicTemplate,
    'formal': FormalTemplate,
    'elegant': ElegantTemplate,
    'remarkable': RemarkableTemplate,
    'classical': ClassicalTemplate,
    'modern': ModernTemplate,
    'simple': SimpleTemplate,
    'robust': RobustTemplate,
    'sepia': SepiaTemplate,
    'jobboss': JobBossTemplate,
    'monochrome': MonochromeTemplate,
    'ats': ATSTemplate,
};

// Get template component by ID (with fallback)
export function getTemplateComponent(templateId: string): ComponentType<TemplateProps> {
    return templateComponents[templateId] || ProfessionalTemplate;
}

// Get theme for a specific template and color theme ID
export function getTheme(templateId: string, colorThemeId: string): ColorTheme {
    return getThemeForTemplate(templateRegistry, templateId, colorThemeId);
}

// Re-export for convenience
export { getTemplateConfig };
export type { ColorTheme };
