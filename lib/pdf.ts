import puppeteer from 'puppeteer';
import { CVData } from './cv';
import { formatGender, formatLanguageLevel, formatMaritalStatus, getResumeLanguage, resumeText } from './resume-language';
import { ColorTheme, getThemeForTemplate } from './templates';
import { templateRegistry, getTemplateConfig } from './templates/registry';
import { escapeHtml, wrapPage } from './templates/html/utils';

// ============================================================
// SKILL DISPLAY HELPERS - Match React template components
// ============================================================

// 5 filled/unfilled dots (Professional, Formal, Dynamic)
function skillDotsHtml(level: number, filledColor: string, emptyColor: string = '#e5e7eb'): string {
    return `<div style="display: flex; gap: 4px;">${[1, 2, 3, 4, 5].map(dot =>
        `<div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${dot <= level ? filledColor : emptyColor};"></div>`
    ).join('')}</div>`;
}

// Larger dots for Dynamic template (w-2.5 = 10px)
function skillDotsLargeHtml(level: number, filledColor: string, emptyColor: string = 'rgba(0,0,0,0.15)'): string {
    return `<div style="display: flex; gap: 4px;">${[1, 2, 3, 4, 5].map(dot =>
        `<div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${dot <= level ? filledColor : emptyColor};"></div>`
    ).join('')}</div>`;
}

// Progress bar (Modern, Remarkable, Robust)
function skillBarHtml(level: number, maxLevel: number = 5, color: string = 'rgba(255,255,255,0.7)', bgColor: string = 'rgba(255,255,255,0.2)'): string {
    const percentage = Math.min(100, (level / maxLevel) * 100);
    return `<div style="width: 100%; height: 6px; border-radius: 9999px; background-color: ${bgColor};"><div style="width: ${percentage}%; height: 100%; border-radius: 9999px; background-color: ${color};"></div></div>`;
}

// Language level bar
function languageBarHtml(level: string, color: string = 'rgba(255,255,255,0.7)', bgColor: string = 'rgba(255,255,255,0.2)'): string {
    const levelMap: Record<string, number> = {
        'Moedertaal': 100, 'Vloeiend': 85, 'Goed': 65, 'Basis': 35,
        'Native': 100, 'Fluent': 85, 'Good': 65, 'Basic': 35,
    };
    const percentage = levelMap[level] || 50;
    return `<div style="width: 100%; height: 6px; border-radius: 9999px; background-color: ${bgColor};"><div style="width: ${percentage}%; height: 100%; border-radius: 9999px; background-color: ${color};"></div></div>`;
}

// Stars for Sepia template
function skillStarsHtml(level: number): string {
    return `<div style="display: flex; gap: 2px; font-size: 12px;">${[1, 2, 3, 4, 5].map(star =>
        `<span style="opacity: ${star <= level ? 1 : 0.3};">&#10022;</span>`
    ).join('')}</div>`;
}

// Small bars for Elegant template (w-3 h-1)
function skillBarsSegmentHtml(level: number, color: string, emptyColor: string = '#e5e7eb'): string {
    return `<div style="display: flex; gap: 2px;">${[1, 2, 3, 4, 5].map(bar =>
        `<div style="width: 12px; height: 4px; border-radius: 2px; background-color: ${bar <= level ? color : emptyColor};"></div>`
    ).join('')}</div>`;
}

// Helper to get initials from name
function getInitials(name: string | undefined): string {
    if (!name) return 'CV';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function normalizeExternalHref(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '';

    if (/^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed) || /^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return `mailto:${trimmed}`;
    }
    if (/^www\./i.test(trimmed) || /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed)) {
        return `https://${trimmed}`;
    }
    return trimmed;
}

function linkifyText(value: string): string {
    const raw = value || '';
    const tokenPattern = /(https?:\/\/[^\s<]+|www\.[^\s<]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
    const tokenExactPattern = /^(https?:\/\/[^\s<]+|www\.[^\s<]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/;

    return raw
        .split(tokenPattern)
        .map((part) => {
            if (!part) return '';
            if (!tokenExactPattern.test(part)) {
                return escapeHtml(part);
            }
            const href = normalizeExternalHref(part);
            return `<a href="${escapeHtml(href)}" style="color: inherit; text-decoration: underline; word-break: break-all;">${escapeHtml(part)}</a>`;
        })
        .join('');
}

function nl2brLinkified(value: string): string {
    return linkifyText(value).replace(/\n/g, '<br>');
}

// ============================================================
// MAIN DISPATCH
// ============================================================

export function buildHTML(data: CVData, templateId: string, colorThemeId: string): string {
    const template = getTemplateConfig(templateId);
    const theme = getThemeForTemplate(templateRegistry, templateId, colorThemeId);

    if (templateId === 'ats') {
        return buildATSHTML(data, theme);
    }

    switch (template.layout) {
        case 'two-column-left':
            return buildTwoColumnLeftHTML(data, theme, templateId);
        case 'two-column-right':
            return buildTwoColumnRightHTML(data, theme, templateId);
        case 'single-column':
            return buildSingleColumnHTML(data, theme, templateId);
        default:
            return buildTwoColumnLeftHTML(data, theme, templateId);
    }
}

// ============================================================
// TWO-COLUMN-LEFT BUILDER
// Templates: professional, modern, dynamic, sepia, robust, remarkable
// ============================================================

function buildTwoColumnLeftHTML(data: CVData, theme: ColorTheme, templateId: string): string {
    const e = escapeHtml;
    const rt = (key: Parameters<typeof resumeText>[1]) => resumeText(data, key);

    // Template-specific configurations
    const hasColoredSidebar = ['modern', 'sepia'].includes(templateId);
    const hasHeaderBanner = ['dynamic', 'robust'].includes(templateId);
    const isRemarkable = templateId === 'remarkable';
    const isDynamic = templateId === 'dynamic';
    const isRobust = templateId === 'robust';
    const isSepia = templateId === 'sepia';
    const isProfessional = templateId === 'professional';
    const isModern = templateId === 'modern';

    // Sidebar styling
    let sidebarStyle = '';
    let sidebarTextColor = theme.textMuted;
    let sidebarHeadingColor = theme.primary;
    let sidebarWidth = '35%';

    if (hasColoredSidebar) {
        sidebarStyle = `background-color: ${theme.primary}; color: white;`;
        sidebarTextColor = 'rgba(255,255,255,0.9)';
        sidebarHeadingColor = 'rgba(255,255,255,0.7)';
    } else if (isRobust) {
        sidebarStyle = `background-color: #f8f9fa;`;
        sidebarWidth = '32%';
    } else if (isRemarkable) {
        sidebarStyle = `background-color: #fafafa;`;
    } else if (isDynamic) {
        sidebarStyle = `background-color: ${theme.primary}10;`;
    } else {
        // professional and others
        sidebarStyle = `background-color: ${theme.headerBg || `${theme.primary}10`};`;
    }

    // ---- PHOTO ----
    const photoShape = isRemarkable ? 'border-radius: 50%;' : (hasColoredSidebar ? 'border-radius: 8px;' : 'border-radius: 50%;');
    const photoSize = isRobust ? '64px' : (isRemarkable ? '96px' : '112px');

    const photoHtml = `
        <div style="display: flex; justify-content: center; margin-bottom: 16px;">
            ${data.personal.photo
                ? `<img src="${e(data.personal.photo)}" alt="${e(data.personal.name || rt('profilePhotoAlt'))}" style="width: ${photoSize}; height: ${photoSize}; ${photoShape} object-fit: cover; ${hasColoredSidebar ? 'border: 4px solid rgba(255,255,255,0.2);' : `border: 4px solid ${theme.primary};`}" />`
                : `<div style="width: ${photoSize}; height: ${photoSize}; ${photoShape} display: flex; align-items: center; justify-content: center; font-size: ${isRobust ? '20px' : '32px'}; font-weight: bold; ${
                    hasColoredSidebar ? 'background-color: rgba(255,255,255,0.2); color: white;'
                    : isRemarkable ? `background-color: ${theme.primary}; color: #ffffff;`
                    : isProfessional ? `background-color: ${theme.primary}; color: white;`
                    : `background-color: rgba(255,255,255,0.2); color: ${theme.primary};`
                }">
                    ${e(getInitials(data.personal.name))}
                   </div>`
            }
        </div>
    `;

    // ---- NAME IN SIDEBAR (for colored sidebar templates + remarkable) ----
    const sidebarNameHtml = (hasColoredSidebar || isRemarkable) ? `
        <div style="text-align: center; margin-bottom: 16px;">
            <h1 style="font-size: ${isRemarkable ? '18px' : '20px'}; font-weight: bold; ${isSepia ? 'font-family: Georgia, serif;' : ''} text-transform: ${hasColoredSidebar ? 'uppercase' : 'none'}; letter-spacing: 0.05em; margin: 0; color: ${hasColoredSidebar ? 'white' : theme.text};">
                ${e(data.personal.name || rt('nameFallback'))}
            </h1>
            ${data.personal.title ? `<p style="font-size: 12px; margin-top: 4px; ${isSepia ? 'font-style: italic; font-family: Georgia, serif;' : ''} ${hasColoredSidebar ? 'opacity: 0.8; color: white;' : `color: ${theme.primary};`}">${e(data.personal.title)}</p>` : ''}
        </div>
    ` : '';

    // ---- SIDEBAR SECTION HEADING HELPER ----
    function sidebarHeading(title: string): string {
        if (isProfessional) {
            return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; color: ${theme.primary}; display: flex; align-items: center; gap: 8px;"><span>&#9679;</span> ${title}</h2>`;
        }
        if (isDynamic) {
            return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; color: ${theme.primary}; display: flex; align-items: center; gap: 8px;"><span>&#9670;</span> ${title}</h2>`;
        }
        if (isRemarkable) {
            return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; color: ${theme.primary}; display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 16px; height: 2px; background-color: ${theme.primary};"></span> ${title}</h2>`;
        }
        if (isRobust) {
            return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; padding-bottom: 4px; color: ${theme.primary}; border-bottom: 2px solid ${theme.primary};">${title}</h2>`;
        }
        if (isSepia) {
            return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; opacity: 0.7; color: white; font-family: Georgia, serif;">${title}</h2>`;
        }
        // modern
        return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; opacity: 0.7; color: white;">${title}</h2>`;
    }

    // ---- MAIN CONTENT HEADING HELPER ----
    function mainHeading(title: string): string {
        if (isProfessional) {
            return `<h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; color: ${theme.primary}; display: flex; align-items: center; gap: 8px;"><span>&#9679;</span> ${title}</h2>`;
        }
        if (isDynamic) {
            return `<h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding-bottom: 8px; color: ${theme.primary}; border-bottom: 2px solid ${theme.primary};">${title}</h2>`;
        }
        if (isRemarkable) {
            return `<h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; color: ${theme.primary}; display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 24px; height: 2px; background-color: ${theme.primary};"></span> ${title}</h2>`;
        }
        if (isRobust) {
            return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; padding-bottom: 4px; color: ${theme.primary}; border-bottom: 2px solid ${theme.primary};">${title}</h2>`;
        }
        if (isSepia) {
            return `<h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; color: ${theme.primary}; font-family: Georgia, serif;">${title}</h2>`;
        }
        // modern: underline bar
        return `<div style="margin-bottom: 16px;"><h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; color: ${theme.primary};">${title}</h2><div style="width: 48px; height: 4px; background-color: ${theme.primary};"></div></div>`;
    }

    // ---- PERSONALIA SECTION ----
    const personaliaTitle = isProfessional ? rt('personalDetails') : (hasColoredSidebar ? rt('personalDetails') : (isDynamic ? rt('personalDetails') : rt('personalDetails')));

    const personaliaHtml = `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${sidebarHeading(personaliaTitle)}
            <div style="font-size: 12px; color: ${hasColoredSidebar ? 'rgba(255,255,255,0.9)' : theme.textMuted}; line-height: 1.6;">
                ${data.personal.address ? `<div style="margin-bottom: 4px;${isProfessional || isRemarkable ? ` font-weight: 600; color: ${theme.text};` : ''}">${e(data.personal.address)}</div>` : ''}
                ${data.personal.postalCode ? `<div style="margin-bottom: 8px;">${e(data.personal.postalCode)}</div>` : ''}
                ${data.personal.phone ? `<div style="margin-bottom: 4px;">${e(data.personal.phone)}</div>` : ''}
                ${data.personal.email ? `<div style="margin-bottom: 4px; word-break: break-all;">${linkifyText(data.personal.email)}</div>` : ''}
                ${data.personal.birthDate ? `
                    <div style="margin-top: 8px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.text};`} font-size: 10px;">${rt('birthDate')}</div>
                        <div>${e(data.personal.birthDate)}</div>
                        ${data.personal.birthPlace ? `<div>${e(data.personal.birthPlace)}</div>` : ''}
                    </div>
                ` : ''}
                ${data.personal.nationality ? `
                    <div style="margin-top: 6px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.text};`} font-size: 10px;">${rt('nationality')}</div>
                        <div>${e(data.personal.nationality)}</div>
                    </div>
                ` : ''}
                ${data.personal.driversLicense ? `
                    <div style="margin-top: 6px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.text};`} font-size: 10px;">${rt('driversLicense')}</div>
                        <div>${e(data.personal.driversLicense)}</div>
                    </div>
                ` : ''}
                ${data.personal.gender ? `
                    <div style="margin-top: 6px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.text};`} font-size: 10px;">${rt('gender')}</div>
                        <div>${e(formatGender(data.personal.gender, data))}</div>
                    </div>
                ` : ''}
                ${data.personal.maritalStatus ? `
                    <div style="margin-top: 6px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.text};`} font-size: 10px;">${rt('maritalStatus')}</div>
                        <div>${e(formatMaritalStatus(data.personal.maritalStatus, data))}</div>
                    </div>
                ` : ''}
                ${data.personal.linkedIn ? `
                    <div style="margin-top: 6px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.text};`} font-size: 10px;">${isProfessional ? rt('links') : 'LinkedIn'}</div>
                        <div style="word-break: break-all;">${linkifyText(data.personal.linkedIn)}</div>
                    </div>
                ` : ''}
                ${data.personal.github ? `
                    <div style="margin-top: 6px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.text};`} font-size: 10px;">GitHub</div>
                        <div style="word-break: break-all;">${linkifyText(data.personal.github)}</div>
                    </div>
                ` : ''}
                ${data.personal.website ? `
                    <div style="margin-top: 6px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.text};`} font-size: 10px;">Website</div>
                        <div style="word-break: break-all;">${linkifyText(data.personal.website)}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // ---- PERSONALIA (add page-break-inside: avoid) ----
    // Note: personaliaHtml already has margin-bottom wrapping div, add class

    // ---- SKILLS ----
    function buildSkillItem(skill: { name: string; level: number }): string {
        if (isProfessional) {
            return `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 12px; color: ${theme.text};">${e(skill.name)}</span>${skillDotsHtml(skill.level || 3, theme.primary)}</div>`;
        }
        if (isDynamic) {
            return `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 12px; color: ${theme.text};">${e(skill.name)}</span>${skillDotsLargeHtml(skill.level || 3, theme.primary)}</div>`;
        }
        if (isSepia) {
            return `<div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.9;"><span style="font-size: 12px; color: white;">${e(skill.name)}</span>${skillStarsHtml(skill.level || 3)}</div>`;
        }
        if (hasColoredSidebar) {
            // modern
            return `<div><div style="font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.9);">${e(skill.name)}</div>${skillBarHtml(skill.level || 3, 5, 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.2)')}</div>`;
        }
        // remarkable, robust
        const barBg = isRobust ? '#e5e7eb' : '#e5e7eb';
        return `<div><div style="font-size: 12px; margin-bottom: 4px; color: ${theme.text};">${e(skill.name)}</div>${skillBarHtml(skill.level || 3, 5, theme.primary, barBg)}</div>`;
    }

    const skillsHtml = data.skills.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${sidebarHeading(rt('skills'))}
            <div style="display: flex; flex-direction: column; gap: ${isProfessional || isDynamic ? '8px' : '12px'};">
                ${data.skills.map(skill => buildSkillItem(skill)).join('')}
            </div>
        </div>
    ` : '';

    // ---- LANGUAGES ----
    function buildLanguageItem(lang: { name: string; level: string }): string {
        if (isProfessional) {
            return `<div><div style="font-size: 12px; font-weight: 500; color: ${theme.text};">${e(lang.name)}</div>${lang.level ? `<div style="font-size: 12px; color: ${theme.textMuted};">${e(formatLanguageLevel(lang.level, data))}</div>` : ''}</div>`;
        }
        if (isSepia) {
            return `<div><div style="font-size: 12px; font-weight: 500; opacity: 0.9; color: white;">${e(lang.name)}</div>${lang.level ? `<div style="font-size: 12px; opacity: 0.6; font-style: italic; color: white;">${e(formatLanguageLevel(lang.level, data))}</div>` : ''}</div>`;
        }
        if (hasColoredSidebar) {
            // modern
            return `<div><div style="font-size: 12px; font-weight: 500; margin-bottom: 4px; opacity: 0.9; color: white;">${e(lang.name)}</div>${lang.level ? languageBarHtml(lang.level, 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.2)') : ''}</div>`;
        }
        if (isDynamic) {
            return `<div><div style="font-size: 12px; font-weight: 500; margin-bottom: 4px; color: ${theme.text};">${e(lang.name)}</div>${lang.level ? languageBarHtml(lang.level, theme.primary, 'rgba(0,0,0,0.1)') : ''}</div>`;
        }
        // remarkable, robust
        return `<div><div style="font-size: 12px; font-weight: 500; margin-bottom: 4px; color: ${theme.text};">${e(lang.name)}</div>${lang.level ? languageBarHtml(lang.level, theme.primary, '#e5e7eb') : ''}</div>`;
    }

    const languagesHtml = data.languages.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${sidebarHeading(rt('languages'))}
            <div style="display: flex; flex-direction: column; gap: ${isProfessional ? '8px' : '12px'};">
                ${data.languages.map(lang => buildLanguageItem(lang)).join('')}
            </div>
        </div>
    ` : '';

    // ---- INTERESTS ----
    const interestsHtml = data.interests && data.interests.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${sidebarHeading(rt('interests'))}
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${data.interests.map(interest => `
                    <span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background-color: ${hasColoredSidebar ? 'rgba(255,255,255,0.15)' : `${theme.primary}20`}; color: ${hasColoredSidebar ? 'rgba(255,255,255,0.9)' : theme.text};">
                        ${e(interest)}
                    </span>
                `).join('')}
            </div>
        </div>
    ` : '';

    // ---- HEADER BANNER (dynamic, robust) ----
    let headerBannerHtml = '';
    if (isDynamic) {
        headerBannerHtml = `
            <div style="background-color: ${theme.primary}; padding: 32px 48px;">
                <div style="display: flex; align-items: center; gap: 24px;">
                    ${data.personal.photo
                        ? `<img src="${e(data.personal.photo)}" alt="${e(data.personal.name || rt('profilePhotoAlt'))}" style="width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 4px solid ${theme.background};" />`
                        : `<div style="width: 96px; height: 96px; border-radius: 50%; background-color: ${theme.background}; display: flex; align-items: center; justify-content: center; color: ${theme.primary}; font-size: 24px; font-weight: bold; border: 4px solid ${theme.background};">${e(getInitials(data.personal.name))}</div>`
                    }
                    <div style="color: white;">
                        <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 0.05em; margin: 0;">${e(data.personal.name || rt('nameFallback'))}</h1>
                        ${data.personal.title ? `<p style="font-size: 18px; margin-top: 4px; opacity: 0.9;">${e(data.personal.title)}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    } else if (isRobust) {
        headerBannerHtml = `
            <div style="background-color: ${theme.primary}; padding: 24px 32px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    ${data.personal.photo
                        ? `<img src="${e(data.personal.photo)}" alt="${e(data.personal.name || rt('profilePhotoAlt'))}" style="width: 64px; height: 64px; border-radius: 4px; object-fit: cover; border: 2px solid rgba(255,255,255,0.3);" />`
                        : `<div style="width: 64px; height: 64px; border-radius: 4px; background-color: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: bold;">${e(getInitials(data.personal.name))}</div>`
                    }
                    <div style="color: white; flex: 1;">
                        <h1 style="font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">${e(data.personal.name || rt('nameFallback'))}</h1>
                        ${data.personal.title ? `<p style="font-size: 14px; margin-top: 4px; opacity: 0.9;">${e(data.personal.title)}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // ---- MAIN CONTENT HEADER (for templates without banner and without colored sidebar) ----
    const headerHtml = (!hasHeaderBanner && !hasColoredSidebar && !isRemarkable) ? `
        <div style="border-bottom: 2px solid ${theme.primary}; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="font-size: 28px; font-weight: bold; ${isProfessional ? '' : 'text-transform: uppercase; letter-spacing: 0.05em;'} margin: 0; color: ${theme.primary};">
                ${e(data.personal.name || rt('nameFallback'))}
            </h1>
            ${data.personal.title ? `<p style="font-size: 18px; margin-top: 8px; color: ${theme.textMuted};">${e(data.personal.title)}</p>` : ''}
        </div>
    ` : '';

    // ---- SEPIA DECORATIVE HEADER ----
    const sepiaDecorativeHtml = isSepia ? `
        <div style="text-align: center; margin-bottom: 16px;">
            <div style="width: 64px; height: 2px; margin: 0 auto 8px; background-color: ${theme.primary};"></div>
            <span style="font-size: 11px; font-family: Georgia, serif; text-transform: uppercase; letter-spacing: 0.1em; color: ${theme.primary};">Curriculum Vitae</span>
            <div style="width: 64px; height: 2px; margin: 8px auto 0; background-color: ${theme.primary};"></div>
        </div>
    ` : '';

    // ---- SUMMARY ----
    let summaryHtml = '';
    if (data.personal.summary) {
        if (isProfessional) {
            // Professional: just text, no heading
            summaryHtml = `<div style="margin-bottom: 24px;"><p style="font-size: 13px; line-height: 1.6; color: ${theme.text}; white-space: pre-wrap;">${nl2brLinkified(data.personal.summary)}</p></div>`;
        } else if (isRemarkable) {
            // Remarkable: italic with left border
            summaryHtml = `<div style="margin-bottom: 24px;"><p style="font-size: 13px; line-height: 1.6; color: ${theme.text}; font-style: italic; padding-left: 16px; border-left: 3px solid ${theme.primary}; white-space: pre-wrap;">${nl2brLinkified(data.personal.summary)}</p></div>`;
        } else {
            summaryHtml = `<div style="margin-bottom: 24px;">${mainHeading(rt('profile'))}<p style="font-size: 13px; line-height: 1.6; color: ${theme.text}; ${isSepia ? 'font-weight: 300; font-family: Georgia, serif;' : ''} white-space: pre-wrap;">${nl2brLinkified(data.personal.summary)}</p></div>`;
        }
    }

    // ---- EXPERIENCE ----
    function buildExperienceItem(exp: CVData['experience'][0]): string {
        const highlightMarker = isSepia ? '&#10022;' : (isDynamic ? '&bull;' : (isRemarkable ? '&#9642;' : (isModern ? '&#9656;' : '&bull;')));

        if (isDynamic) {
            // Timeline with dot marker
            return `
                <div class="cv-item" style="position: relative; padding-left: 16px; border-left: 2px solid ${theme.border}; margin-bottom: 16px;">
                    <div style="position: absolute; left: -5px; top: 4px; width: 8px; height: 8px; border-radius: 50%; background-color: ${theme.primary};"></div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${theme.text};">${e(exp.role)}</h3>
                            <p style="font-size: 12px; color: ${theme.secondary}; margin-top: 2px;">${e(exp.company)}${exp.location ? `, ${e(exp.location)}` : ''}</p>
                        </div>
                        <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background-color: ${theme.primary}15; color: ${theme.primary}; white-space: nowrap;">${e(exp.start)} - ${e(exp.end)}</span>
                    </div>
                    ${exp.description ? `<p style="font-size: 12px; margin-top: 8px; line-height: 1.5; color: ${theme.textMuted};">${nl2brLinkified(exp.description)}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${exp.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 2px; display: flex; gap: 8px;"><span style="color: ${theme.primary};">${highlightMarker}</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
                </div>
            `;
        }
        if (isProfessional) {
            // Left border style
            return `
                <div class="cv-item" style="position: relative; padding-left: 16px; border-left: 2px solid ${theme.primary}; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${theme.text};">${e(exp.role)}</h3>
                            <div style="font-size: 13px; color: ${theme.primary}; margin-top: 2px;">${e(exp.company)}${exp.location ? `, ${e(exp.location)}` : ''}</div>
                        </div>
                        <span style="font-size: 11px; color: ${theme.textMuted}; white-space: nowrap;">${e(exp.start)} - ${e(exp.end)}</span>
                    </div>
                    ${exp.description ? `<p style="font-size: 12px; margin-top: 8px; line-height: 1.5; color: ${theme.textMuted};">${nl2brLinkified(exp.description)}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${exp.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 4px; display: flex; gap: 8px;"><span style="color: ${theme.primary};">&bull;</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
                </div>
            `;
        }
        if (isRemarkable) {
            return `
                <div class="cv-item" style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${theme.primary};">${e(exp.role)}</h3>
                            <p style="font-size: 12px; color: ${theme.secondary}; margin-top: 2px;">${e(exp.company)}${exp.location ? `, ${e(exp.location)}` : ''}</p>
                        </div>
                        <span style="font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 4px; background-color: ${theme.primary}10; color: ${theme.primary}; white-space: nowrap;">${e(exp.start)} - ${e(exp.end)}</span>
                    </div>
                    ${exp.description ? `<p style="font-size: 12px; margin-top: 8px; line-height: 1.5; color: ${theme.textMuted};">${nl2brLinkified(exp.description)}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${exp.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 4px; display: flex; gap: 8px;"><span style="color: ${theme.primary};">${highlightMarker}</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
                </div>
            `;
        }
        // modern, sepia, robust - default date style
        const dateBadge = (templateId === 'modern') ?
            `<span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background-color: ${theme.primary}15; color: ${theme.primary}; white-space: nowrap;">${e(exp.start)} - ${e(exp.end)}</span>` :
            `<span style="font-size: 11px; color: ${theme.textMuted}; white-space: nowrap;">${e(exp.start)} - ${e(exp.end)}</span>`;

        return `
            <div class="cv-item" style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${theme.text}; ${isSepia ? 'font-family: Georgia, serif;' : ''}">${e(exp.role)}</h3>
                        <p style="font-size: 12px; color: ${theme.secondary}; margin-top: 2px; ${isSepia ? 'font-family: Georgia, serif; font-style: italic;' : ''}">${e(exp.company)}${exp.location ? (isRobust ? ` | ${e(exp.location)}` : ` &#8226; ${e(exp.location)}`) : ''}</p>
                    </div>
                    ${dateBadge}
                </div>
                ${exp.description ? `<p style="font-size: 12px; margin-top: 8px; line-height: 1.5; color: ${theme.textMuted}; ${isSepia ? 'font-weight: 300;' : ''}">${nl2brLinkified(exp.description)}</p>` : ''}
                ${exp.highlights && exp.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${exp.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 2px; display: flex; gap: 8px; ${isSepia ? 'font-weight: 300;' : ''}"><span style="color: ${theme.primary};">${highlightMarker}</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
            </div>
        `;
    }

    const experienceHtml = data.experience.length > 0 ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('experience'))}
            ${data.experience.map(exp => buildExperienceItem(exp)).join('')}
        </div>
    ` : '';

    // ---- INTERNSHIPS ----
    const internshipsHtml = data.internships && data.internships.length > 0 ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('internships'))}
            ${data.internships.map(intern => {
                if (isDynamic) {
                    return `
                        <div class="cv-item" style="position: relative; padding-left: 16px; border-left: 2px solid ${theme.secondary || theme.primary}; margin-bottom: 12px;">
                            <div style="position: absolute; left: -5px; top: 4px; width: 8px; height: 8px; border-radius: 50%; background-color: ${theme.secondary || theme.primary};"></div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <h3 style="font-weight: bold; font-size: 13px; margin: 0; color: ${theme.text};">${e(intern.role)}</h3>
                                    <p style="font-size: 12px; color: ${theme.secondary}; margin-top: 2px;">${e(intern.company)}${intern.location ? `, ${e(intern.location)}` : ''}</p>
                                </div>
                                <span style="font-size: 11px; color: ${theme.textMuted}; white-space: nowrap;">${e(intern.start)} - ${e(intern.end)}</span>
                            </div>
                            ${intern.description ? `<p style="font-size: 12px; margin-top: 6px; line-height: 1.5; color: ${theme.textMuted};">${nl2brLinkified(intern.description)}</p>` : ''}
                            ${intern.highlights && intern.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${intern.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 2px; display: flex; gap: 8px;"><span style="color: ${theme.primary};">&bull;</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
                        </div>
                    `;
                }
                if (isProfessional) {
                    return `
                        <div class="cv-item" style="position: relative; padding-left: 16px; border-left: 2px solid ${theme.secondary || theme.primary}; margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${theme.text};">${e(intern.role)}</h3>
                                    <div style="font-size: 13px; color: ${theme.primary}; margin-top: 2px;">${e(intern.company)}${intern.location ? `, ${e(intern.location)}` : ''}</div>
                                </div>
                                <span style="font-size: 11px; color: ${theme.textMuted}; white-space: nowrap;">${e(intern.start)} - ${e(intern.end)}</span>
                            </div>
                            ${intern.description ? `<p style="font-size: 12px; margin-top: 8px; line-height: 1.5; color: ${theme.textMuted};">${nl2brLinkified(intern.description)}</p>` : ''}
                            ${intern.highlights && intern.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${intern.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 4px; display: flex; gap: 8px;"><span style="color: ${theme.primary};">&bull;</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
                        </div>
                    `;
                }
                return `
                    <div class="cv-item" style="margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h3 style="font-weight: bold; font-size: 13px; margin: 0; color: ${theme.text}; ${isSepia ? 'font-family: Georgia, serif;' : ''}">${e(intern.role)}</h3>
                                <p style="font-size: 12px; color: ${theme.secondary}; margin-top: 2px; ${isSepia ? 'font-family: Georgia, serif; font-style: italic;' : ''}">${e(intern.company)}${intern.location ? `, ${e(intern.location)}` : ''}</p>
                            </div>
                            <span style="font-size: 11px; color: ${theme.textMuted}; white-space: nowrap; ${isSepia ? 'font-family: Georgia, serif; font-style: italic;' : ''}">${e(intern.start)} - ${e(intern.end)}</span>
                        </div>
                        ${intern.description ? `<p style="font-size: 12px; margin-top: 6px; line-height: 1.5; color: ${theme.textMuted}; ${isSepia ? 'font-weight: 300;' : ''}">${nl2brLinkified(intern.description)}</p>` : ''}
                        ${intern.highlights && intern.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${intern.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 2px; display: flex; gap: 8px; ${isSepia ? 'font-weight: 300;' : ''}"><span style="color: ${theme.primary};">${isSepia ? '&#10022;' : (isRemarkable ? '&#9642;' : (isModern ? '&#9656;' : '&bull;'))}</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    ` : '';

    // ---- EDUCATION ----
    const educationHtml = data.education.length > 0 ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('education'))}
            ${data.education.map(edu => {
                if (isDynamic) {
                    return `
                        <div class="cv-item" style="position: relative; padding-left: 16px; border-left: 2px solid ${theme.border}; margin-bottom: 12px;">
                            <div style="position: absolute; left: -5px; top: 4px; width: 8px; height: 8px; border-radius: 50%; background-color: ${theme.secondary || theme.primary};"></div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${theme.text};">${e(edu.degree)}</h3>
                                    <p style="font-size: 12px; color: ${theme.textMuted}; margin-top: 2px;">${e(edu.school)}${edu.location ? `, ${e(edu.location)}` : ''}</p>
                                </div>
                                <span style="font-size: 11px; color: ${theme.textMuted}; white-space: nowrap;">${e(edu.start)} - ${e(edu.end)}</span>
                            </div>
                            ${edu.description ? `<p style="font-size: 12px; margin-top: 4px; line-height: 1.5; color: ${theme.textMuted};">${e(edu.description)}</p>` : ''}
                        </div>
                    `;
                }
                if (isProfessional) {
                    return `
                        <div class="cv-item" style="position: relative; padding-left: 16px; border-left: 2px solid ${theme.primary}; margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${theme.text};">${e(edu.degree)}</h3>
                                    <div style="font-size: 13px; color: ${theme.primary}; margin-top: 2px;">${e(edu.school)}${edu.location ? `, ${e(edu.location)}` : ''}</div>
                                </div>
                                <span style="font-size: 11px; color: ${theme.textMuted}; white-space: nowrap;">${e(edu.start)} - ${e(edu.end)}</span>
                            </div>
                            ${edu.description ? `<p style="font-size: 12px; margin-top: 8px; line-height: 1.5; color: ${theme.textMuted};">${e(edu.description)}</p>` : ''}
                        </div>
                    `;
                }
                return `
                    <div class="cv-item" style="margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h3 style="font-weight: bold; font-size: 13px; margin: 0; color: ${theme.text}; ${isSepia ? 'font-family: Georgia, serif;' : ''}">${e(edu.degree)}</h3>
                                <p style="font-size: 12px; color: ${theme.textMuted}; margin-top: 2px; ${isSepia ? 'font-weight: 300;' : ''}">${e(edu.school)}${edu.location ? `, ${e(edu.location)}` : ''}</p>
                                ${edu.description ? `<p style="font-size: 11px; margin-top: 4px; color: ${theme.textMuted}; ${isSepia ? 'font-weight: 300;' : ''}">${e(edu.description)}</p>` : ''}
                            </div>
                            <span style="font-size: 11px; color: ${theme.textMuted}; white-space: nowrap; ${isSepia ? 'font-family: Georgia, serif; font-style: italic;' : ''}">${e(edu.start)} - ${e(edu.end)}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    ` : '';

    // ---- COURSES ----
    const coursesHtml = data.courses && data.courses.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${mainHeading(isRobust ? rt('coursesShort') : rt('courses'))}
            ${data.courses.map(course => `
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 500; color: ${theme.text}; ${isSepia ? 'font-family: Georgia, serif;' : ''}">${e(course.name)}</span>
                    <span style="font-size: 11px; color: ${theme.textMuted}; ${isSepia ? 'font-family: Georgia, serif; font-style: italic;' : ''}">
                        ${e(course.institution)}${course.year ? ` &#8226; ${e(course.year)}` : ''}
                    </span>
                </div>
            `).join('')}
        </div>
    ` : '';

    // ---- AWARDS ----
    const awardsHtml = data.awards && data.awards.length > 0 ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('awards'))}
            <ul style="margin: 0; padding: 0; list-style: none;">
                ${data.awards.map(award => `
                    <li class="cv-item" style="font-size: 12px; color: ${theme.text}; margin-bottom: 4px; display: flex; gap: 8px; ${isSepia ? 'font-weight: 300;' : ''}">
                        <span style="color: ${theme.primary};">${isProfessional ? '&bull;' : (isDynamic ? '&bull;' : (isSepia ? '&#10022;' : (isRemarkable ? '&#9642;' : '&bull;')))}</span>
                        <span>${e(award)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    // ---- REMARKABLE ACCENT BAR ----
    const accentBar = isRemarkable ? `<div style="width: 2px; min-height: 297mm; background-color: ${theme.primary};"></div>` : '';

    // ---- ASSEMBLE ----
    const content = `
        <div style="background-color: ${isSepia ? '#fefcf9' : 'white'}; min-height: 297mm; width: 210mm; margin: 0 auto; ${isSepia ? 'font-family: Georgia, serif;' : ''}">
            ${headerBannerHtml}
            <div style="display: flex; min-height: ${hasHeaderBanner ? (isRobust ? 'calc(297mm - 88px)' : 'calc(297mm - 120px)') : '297mm'};">
                ${accentBar}
                <!-- Left Sidebar -->
                <div style="width: ${sidebarWidth}; padding: 24px; ${sidebarStyle}">
                    ${!hasHeaderBanner ? photoHtml : ''}
                    ${sidebarNameHtml}
                    ${personaliaHtml}
                    ${skillsHtml}
                    ${languagesHtml}
                    ${interestsHtml}
                </div>
                <!-- Main Content -->
                <div style="flex: 1; padding: ${isRobust ? '20px' : '24px 32px'}; color: ${theme.text};">
                    ${headerHtml}
                    ${sepiaDecorativeHtml}
                    ${summaryHtml}
                    ${experienceHtml}
                    ${internshipsHtml}
                    ${educationHtml}
                    ${coursesHtml}
                    ${awardsHtml}
                </div>
            </div>
        </div>
    `;

    return wrapPage(content, theme, getResumeLanguage(data));
}

// ============================================================
// TWO-COLUMN-RIGHT BUILDER
// Templates: formal (colored sidebar), elegant (light sidebar), jobboss
// ============================================================

function buildTwoColumnRightHTML(data: CVData, theme: ColorTheme, templateId: string): string {
    const e = escapeHtml;
    const rt = (key: Parameters<typeof resumeText>[1]) => resumeText(data, key);
    const isFormal = templateId === 'formal';
    const isElegant = templateId === 'elegant';
    const hasColoredSidebar = isFormal;

    const sidebarStyle = hasColoredSidebar
        ? `background-color: ${theme.primary}; color: white;`
        : isElegant
            ? `background-color: ${theme.primary}08; border-left: 1px solid ${theme.border};`
            : `background-color: ${theme.primary}08; border-left: 1px solid ${theme.border};`;

    const sidebarTextColor = hasColoredSidebar ? 'rgba(255,255,255,0.9)' : theme.textMuted;
    const sidebarHeadingColor = hasColoredSidebar ? 'rgba(255,255,255,0.9)' : theme.primary;
    const mainWidth = isElegant ? '60%' : '65%';
    const sidebarWidth = isElegant ? '40%' : '35%';

    // ---- PHOTO ----
    const photoHtml = `
        <div style="text-align: center; margin-bottom: 24px;">
            ${data.personal.photo
                ? `<img src="${e(data.personal.photo)}" alt="${e(data.personal.name || rt('profilePhotoAlt'))}" style="width: 112px; height: 112px; border-radius: 50%; object-fit: cover; margin: 0 auto; ${hasColoredSidebar ? 'border: 4px solid rgba(255,255,255,0.3);' : `border: 2px solid ${theme.primary};`}" />`
                : `<div style="width: 112px; height: 112px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 36px; font-weight: bold; ${
                    hasColoredSidebar ? `background-color: ${theme.background}; color: ${theme.primary};`
                    : isElegant ? `border: 2px solid ${theme.primary}; color: ${theme.primary}; font-family: Georgia, serif;`
                    : `background-color: rgba(255,255,255,0.2); color: ${theme.primary};`
                }">
                    ${e(getInitials(data.personal.name))}
                   </div>`
            }
        </div>
    `;

    // ---- SIDEBAR HEADING ----
    function sidebarHeading(title: string): string {
        if (isFormal) {
            return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; opacity: 0.9; color: white;">${title}</h2>`;
        }
        // elegant
        return `<h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; color: ${theme.primary}; ${isElegant ? 'font-family: Georgia, serif;' : ''}">${title}</h2>`;
    }

    // ---- MAIN HEADING ----
    function mainHeading(title: string): string {
        if (isFormal) {
            return `<h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 2px solid ${theme.primary}; color: ${theme.text};">${title}</h2>`;
        }
        // elegant
        return `<h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; color: ${theme.primary}; font-family: Georgia, serif;">${title}</h2>`;
    }

    // ---- PERSONALIA ----
    const contactHtml = `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${sidebarHeading(rt('personalDetails'))}
            <div style="font-size: 12px; color: ${sidebarTextColor}; line-height: 1.6;">
                ${data.personal.address ? `<div style="margin-bottom: 4px; ${!hasColoredSidebar ? `font-weight: 500; color: ${theme.text};` : 'font-weight: 600;'}">${e(data.personal.address)}</div>` : ''}
                ${data.personal.postalCode ? `<div style="margin-bottom: 6px;">${e(data.personal.postalCode)}</div>` : ''}
                ${data.personal.email ? `<div style="margin-bottom: 6px; word-break: break-all;">${linkifyText(data.personal.email)}</div>` : ''}
                ${data.personal.phone ? `<div style="margin-bottom: 6px;">${e(data.personal.phone)}</div>` : ''}
                ${data.personal.birthDate ? `
                    <div style="margin-top: 8px;">
                        <div style="font-weight: 600; ${hasColoredSidebar ? '' : `color: ${theme.text};`}">${rt('birthDate')}</div>
                        <div>${e(data.personal.birthDate)}</div>
                        ${data.personal.birthPlace ? `<div>${e(data.personal.birthPlace)}</div>` : ''}
                    </div>
                ` : ''}
                ${data.personal.nationality ? `<div style="margin-top: 6px;"><div style="font-weight: 600; ${hasColoredSidebar ? '' : `color: ${theme.text};`}">${rt('nationality')}</div><div>${e(data.personal.nationality)}</div></div>` : ''}
                ${data.personal.driversLicense ? `<div style="margin-top: 6px;"><div style="font-weight: 600; ${hasColoredSidebar ? '' : `color: ${theme.text};`}">${rt('driversLicense')}</div><div>${e(data.personal.driversLicense)}</div></div>` : ''}
                ${data.personal.gender ? `<div style="margin-top: 6px;"><div style="font-weight: 600; ${hasColoredSidebar ? '' : `color: ${theme.text};`}">${rt('gender')}</div><div>${e(formatGender(data.personal.gender, data))}</div></div>` : ''}
                ${data.personal.maritalStatus ? `<div style="margin-top: 6px;"><div style="font-weight: 600; ${hasColoredSidebar ? '' : `color: ${theme.text};`}">${rt('maritalStatus')}</div><div>${e(formatMaritalStatus(data.personal.maritalStatus, data))}</div></div>` : ''}
                ${data.personal.linkedIn ? `<div style="margin-top: 6px;"><div style="font-weight: 600; ${hasColoredSidebar ? '' : `color: ${theme.text};`}">LinkedIn</div><div style="word-break: break-all;">${linkifyText(data.personal.linkedIn)}</div></div>` : ''}
                ${data.personal.github ? `<div style="margin-top: 6px;"><div style="font-weight: 600; ${hasColoredSidebar ? '' : `color: ${theme.text};`}">GitHub</div><div style="word-break: break-all;">${linkifyText(data.personal.github)}</div></div>` : ''}
                ${data.personal.website ? `<div style="margin-top: 6px;"><div style="font-weight: 600; ${hasColoredSidebar ? '' : `color: ${theme.text};`}">Website</div><div style="word-break: break-all;">${linkifyText(data.personal.website)}</div></div>` : ''}
            </div>
        </div>
    `;

    // ---- SKILLS ----
    const skillsHtml = data.skills.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${sidebarHeading(rt('skills'))}
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${data.skills.map(skill => {
                    if (isFormal) {
                        return `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 12px; opacity: 0.9;">${e(skill.name)}</span>${skillDotsHtml(skill.level || 3, 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.3)')}</div>`;
                    }
                    if (isElegant) {
                        return `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 12px; color: ${theme.text};">${e(skill.name)}</span>${skillBarsSegmentHtml(skill.level || 3, theme.primary)}</div>`;
                    }
                    return `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 12px; color: ${sidebarTextColor};">${e(skill.name)}</span>${skillBarHtml(skill.level || 3, 5, theme.primary, `${theme.primary}20`)}</div>`;
                }).join('')}
            </div>
        </div>
    ` : '';

    // ---- LANGUAGES ----
    const languagesHtml = data.languages.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${sidebarHeading(rt('languages'))}
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${data.languages.map(lang => `
                    <div>
                        <div style="font-size: 12px; font-weight: 500; color: ${hasColoredSidebar ? 'rgba(255,255,255,0.9)' : theme.text};">${e(lang.name)}</div>
                        ${lang.level ? `<div style="font-size: 12px; ${hasColoredSidebar ? 'opacity: 0.7;' : `color: ${theme.textMuted};`} ${isElegant ? 'font-style: italic;' : ''}">${e(formatLanguageLevel(lang.level, data))}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    // ---- INTERESTS ----
    const interestsHtml = data.interests && data.interests.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${sidebarHeading(rt('interests'))}
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${data.interests.map(interest => `
                    <span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; ${
                        hasColoredSidebar ? 'background-color: rgba(255,255,255,0.2);'
                        : isElegant ? `border: 1px solid ${theme.border}; color: ${theme.text};`
                        : `background-color: ${theme.primary}15; color: ${sidebarTextColor};`
                    }">
                        ${e(interest)}
                    </span>
                `).join('')}
            </div>
        </div>
    ` : '';

    // ---- MAIN CONTENT HEADER ----
    const headerHtml = isFormal ? `
        <div style="margin-bottom: 24px;">
            <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 4px 0; color: ${theme.primary};">${e(data.personal.name || rt('nameFallback'))}</h1>
            ${data.personal.title ? `<p style="font-size: 18px; margin: 0; color: ${theme.textMuted};">${e(data.personal.title)}</p>` : ''}
        </div>
    ` : isElegant ? `
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: bold; letter-spacing: 0.05em; margin: 0; font-family: Georgia, serif;">${e(data.personal.name || rt('nameFallback'))}</h1>
            ${data.personal.title ? `<p style="font-size: 16px; margin-top: 8px; font-family: Georgia, serif; font-style: italic; color: ${theme.primary};">${e(data.personal.title)}</p>` : ''}
            <div style="width: 64px; height: 2px; margin: 16px auto 0; background-color: ${theme.primary};"></div>
        </div>
    ` : `
        <div style="margin-bottom: 24px;">
            <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 4px 0; color: ${theme.primary};">${e(data.personal.name || rt('nameFallback'))}</h1>
            ${data.personal.title ? `<p style="font-size: 16px; margin: 0; color: ${theme.textMuted};">${e(data.personal.title)}</p>` : ''}
        </div>
    `;

    // ---- SUMMARY ----
    const summaryHtml = data.personal.summary ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('profile'))}
            <p style="font-size: 13px; line-height: 1.6; color: ${theme.text}; ${isElegant ? 'font-weight: 300;' : ''} white-space: pre-wrap;">${nl2brLinkified(data.personal.summary)}</p>
        </div>
    ` : '';

    // ---- EXPERIENCE ----
    const highlightMarker = isFormal ? '&#9656;' : isElegant ? '&mdash;' : '&bull;';

    const experienceHtml = data.experience.length > 0 ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('experience'))}
            ${data.experience.map(exp => `
                <div class="cv-item" style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${isFormal ? theme.primary : theme.text}; ${isElegant ? 'font-family: Georgia, serif;' : ''}">${e(exp.role)}</h3>
                        <span style="font-size: 11px; color: ${theme.textMuted}; ${isElegant ? 'font-style: italic;' : ''}">${e(exp.start)} - ${e(exp.end)}</span>
                    </div>
                    <div style="font-size: 13px; color: ${theme.secondary}; margin-top: 2px; ${isElegant ? 'font-family: Georgia, serif; font-style: italic;' : 'font-weight: 500;'}">
                        ${e(exp.company)}${exp.location ? ` &#8226; ${e(exp.location)}` : ''}
                    </div>
                    ${exp.description ? `<p style="font-size: 12px; margin-top: 8px; line-height: 1.5; color: ${theme.textMuted}; ${isElegant ? 'font-weight: 300;' : ''}">${nl2brLinkified(exp.description)}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${exp.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 4px; display: flex; gap: 8px; ${isElegant ? 'font-weight: 300;' : ''}"><span style="color: ${theme.primary};">${highlightMarker}</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    // ---- INTERNSHIPS ----
    const internshipsHtml = data.internships && data.internships.length > 0 ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('internships'))}
            ${data.internships.map(intern => `
                <div class="cv-item" style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-weight: bold; font-size: 13px; margin: 0; color: ${isFormal ? theme.primary : theme.text}; ${isElegant ? 'font-family: Georgia, serif;' : ''}">${e(intern.role)}</h3>
                        <span style="font-size: 11px; color: ${theme.textMuted}; ${isElegant ? 'font-style: italic;' : ''}">${e(intern.start)} - ${e(intern.end)}</span>
                    </div>
                    <div style="font-size: 12px; color: ${theme.secondary}; margin-top: 2px; ${isElegant ? 'font-family: Georgia, serif; font-style: italic;' : ''}">${e(intern.company)}${intern.location ? ` &#8226; ${e(intern.location)}` : ''}</div>
                    ${intern.description ? `<p style="font-size: 12px; margin-top: 6px; line-height: 1.5; color: ${theme.textMuted}; ${isElegant ? 'font-weight: 300;' : ''}">${nl2brLinkified(intern.description)}</p>` : ''}
                    ${intern.highlights && intern.highlights.length > 0 ? `<ul style="margin: 8px 0 0 0; padding: 0; list-style: none;">${intern.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 4px; display: flex; gap: 8px; ${isElegant ? 'font-weight: 300;' : ''}"><span style="color: ${theme.primary};">${highlightMarker}</span><span>${e(h)}</span></li>`).join('')}</ul>` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    // ---- EDUCATION ----
    const educationHtml = data.education.length > 0 ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('education'))}
            ${data.education.map(edu => `
                <div class="cv-item" style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-weight: bold; font-size: 13px; margin: 0; color: ${theme.text}; ${isElegant ? 'font-family: Georgia, serif;' : ''}">${e(edu.degree)}</h3>
                        <span style="font-size: 11px; color: ${theme.textMuted}; ${isElegant ? 'font-style: italic;' : ''}">${e(edu.start)} - ${e(edu.end)}</span>
                    </div>
                    <div style="font-size: 12px; color: ${theme.textMuted}; margin-top: 2px; ${isElegant ? 'font-weight: 300;' : ''}">${e(edu.school)}${edu.location ? `, ${e(edu.location)}` : ''}</div>
                    ${edu.description ? `<p style="font-size: 11px; margin-top: 4px; color: ${theme.textMuted}; ${isElegant ? 'font-weight: 300;' : ''}">${e(edu.description)}</p>` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    // ---- COURSES ----
    const coursesHtml = data.courses && data.courses.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            ${mainHeading(rt('courses'))}
            ${data.courses.map(course => `
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 500; ${isElegant ? '' : `color: ${theme.text};`}">${e(course.name)}</span>
                    <span style="font-size: 11px; color: ${theme.textMuted}; ${isElegant ? 'font-style: italic;' : ''}">
                        ${e(course.institution)}${course.year ? ` &#8226; ${e(course.year)}` : ''}
                    </span>
                </div>
            `).join('')}
        </div>
    ` : '';

    // ---- AWARDS ----
    const awardsHtml = data.awards && data.awards.length > 0 ? `
        <div style="margin-bottom: 24px;">
            ${mainHeading(rt('awards'))}
            <ul style="margin: 0; padding: 0; list-style: none;">
                ${data.awards.map(award => `
                    <li class="cv-item" style="font-size: 12px; color: ${theme.text}; margin-bottom: 4px; display: flex; gap: 8px; ${isElegant ? 'font-weight: 300;' : ''}">
                        <span style="color: ${theme.primary};">${isFormal ? '&#9656;' : (isElegant ? '&mdash;' : '&bull;')}</span>
                        <span>${e(award)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    // ---- ASSEMBLE ----
    const content = `
        <div style="background-color: white; min-height: 297mm; width: 210mm; margin: 0 auto; display: flex;">
            <!-- Main Content -->
            <div style="width: ${mainWidth}; padding: ${isElegant || isFormal ? '40px' : '40px 32px'}; color: ${theme.text};">
                ${headerHtml}
                ${summaryHtml}
                ${experienceHtml}
                ${internshipsHtml}
                ${educationHtml}
                ${coursesHtml}
                ${awardsHtml}
            </div>
            <!-- Right Sidebar -->
            <div style="width: ${sidebarWidth}; padding: ${isElegant ? '24px' : '32px'}; ${sidebarStyle}">
                ${photoHtml}
                ${contactHtml}
                ${skillsHtml}
                ${languagesHtml}
                ${interestsHtml}
            </div>
        </div>
    `;

    return wrapPage(content, theme, getResumeLanguage(data));
}

// ============================================================
// SINGLE-COLUMN BUILDER
// Templates: classical, simple, monochrome
// ============================================================

function buildSingleColumnHTML(data: CVData, theme: ColorTheme, templateId: string): string {
    const e = escapeHtml;
    const rt = (key: Parameters<typeof resumeText>[1]) => resumeText(data, key);
    const contactItems = [
        data.personal.email,
        data.personal.phone,
        data.personal.address,
        data.personal.postalCode,
        data.personal.location,
    ].filter((value): value is string => Boolean(value && value.trim()));

    const personalDetailItems: string[] = [];
    if (data.personal.birthDate || data.personal.birthPlace) {
        personalDetailItems.push(
            `${rt('birthDateAndPlace')}: ${e(data.personal.birthDate || '')}${data.personal.birthPlace ? `, ${e(data.personal.birthPlace)}` : ''}`
        );
    }
    if (data.personal.nationality) {
        personalDetailItems.push(`${rt('nationality')}: ${e(data.personal.nationality)}`);
    }
    if (data.personal.driversLicense) {
        personalDetailItems.push(`${rt('driversLicense')}: ${e(data.personal.driversLicense)}`);
    }
    if (data.personal.gender) {
        personalDetailItems.push(`${rt('gender')}: ${e(formatGender(data.personal.gender, data))}`);
    }
    if (data.personal.maritalStatus) {
        personalDetailItems.push(`${rt('maritalStatus')}: ${e(formatMaritalStatus(data.personal.maritalStatus, data))}`);
    }
    if (data.personal.linkedIn) {
        personalDetailItems.push(`LinkedIn: ${linkifyText(data.personal.linkedIn)}`);
    }
    if (data.personal.github) {
        personalDetailItems.push(`GitHub: ${linkifyText(data.personal.github)}`);
    }
    if (data.personal.website) {
        personalDetailItems.push(`Website: ${linkifyText(data.personal.website)}`);
    }

    const headerHtml = `
        <div style="text-align: center; border-bottom: 2px solid ${theme.primary}; padding-bottom: 24px; margin-bottom: 24px;">
            ${data.personal.photo
                ? `<img src="${e(data.personal.photo)}" alt="${e(data.personal.name || rt('profilePhotoAlt'))}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 12px; display: block; border: 3px solid ${theme.primary};" />`
                : ''
            }
            <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 8px 0; color: ${theme.text};">
                ${e(data.personal.name || rt('nameFallback'))}
            </h1>
            ${data.personal.title ? `<p style="font-size: 16px; margin: 0; color: ${theme.textMuted};">${e(data.personal.title)}</p>` : ''}
            <div style="display: flex; justify-content: center; gap: 24px; margin-top: 16px; font-size: 13px; color: ${theme.textMuted}; flex-wrap: wrap;">
                ${contactItems.map((item, index) => `<span>${index > 0 ? '&#8226; ' : ''}${linkifyText(item)}</span>`).join('')}
            </div>
            ${personalDetailItems.length > 0 ? `
                <div style="display: flex; justify-content: center; gap: 18px; margin-top: 12px; font-size: 11px; color: ${theme.textMuted}; flex-wrap: wrap;">
                    ${personalDetailItems.map((item) => `<span>${item}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;

    const summaryHtml = data.personal.summary ? `
        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 12px;">
                ${rt('profile')}
            </h2>
            <p style="font-size: 13px; line-height: 1.6; color: ${theme.text}; white-space: pre-wrap;">${nl2brLinkified(data.personal.summary)}</p>
        </div>
    ` : '';

    const experienceHtml = data.experience.length > 0 ? `
        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 16px; border-bottom: 1px solid ${theme.border}; padding-bottom: 8px;">
                ${rt('experience')}
            </h2>
            ${data.experience.map(exp => `
                <div class="cv-item" style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-weight: bold; font-size: 14px; margin: 0; color: ${theme.text};">${e(exp.role)}</h3>
                        <span style="font-size: 12px; color: ${theme.textMuted};">${e(exp.start)} - ${e(exp.end)}</span>
                    </div>
                    <div style="font-size: 13px; color: ${theme.secondary}; margin-top: 2px;">
                        ${e(exp.company)}${exp.location ? ` | ${e(exp.location)}` : ''}
                    </div>
                    ${exp.description ? `<p style="font-size: 13px; margin-top: 8px; line-height: 1.5; color: ${theme.textMuted};">${nl2brLinkified(exp.description)}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `
                        <ul style="margin: 6px 0 0 0; padding-left: 20px;">
                            ${exp.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 2px;">${e(h)}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    const internshipsHtml = data.internships && data.internships.length > 0 ? `
        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 16px; border-bottom: 1px solid ${theme.border}; padding-bottom: 8px;">
                ${rt('internships')}
            </h2>
            ${data.internships.map(intern => `
                <div class="cv-item" style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-weight: bold; font-size: 13px; margin: 0; color: ${theme.text};">${e(intern.role)}</h3>
                        <span style="font-size: 12px; color: ${theme.textMuted};">${e(intern.start)} - ${e(intern.end)}</span>
                    </div>
                    <div style="font-size: 12px; color: ${theme.textMuted}; margin-top: 2px;">${e(intern.company)}</div>
                    ${intern.description ? `<p style="font-size: 12px; margin-top: 6px; line-height: 1.5; color: ${theme.textMuted};">${nl2brLinkified(intern.description)}</p>` : ''}
                    ${intern.highlights && intern.highlights.length > 0 ? `
                        <ul style="margin: 6px 0 0 0; padding-left: 20px;">
                            ${intern.highlights.map(h => `<li style="font-size: 12px; color: ${theme.text}; margin-bottom: 2px;">${e(h)}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    const educationHtml = data.education.length > 0 ? `
        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 16px; border-bottom: 1px solid ${theme.border}; padding-bottom: 8px;">
                ${rt('educationSingle')}
            </h2>
            ${data.education.map(edu => `
                <div class="cv-item" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                    <div>
                        <h3 style="font-weight: bold; font-size: 13px; margin: 0; color: ${theme.text};">${e(edu.degree)}</h3>
                        <div style="font-size: 12px; color: ${theme.textMuted}; margin-top: 2px;">${e(edu.school)}</div>
                    </div>
                    <span style="font-size: 12px; color: ${theme.textMuted};">${e(edu.start)} - ${e(edu.end)}</span>
                </div>
            `).join('')}
        </div>
    ` : '';

    const coursesHtml = data.courses && data.courses.length > 0 ? `
        <div class="cv-section-small" style="margin-bottom: 24px;">
            <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 12px; border-bottom: 1px solid ${theme.border}; padding-bottom: 8px;">
                ${rt('courses')}
            </h2>
            ${data.courses.map(course => `
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 500;">${e(course.name)}</span>
                    <span style="font-size: 11px; color: ${theme.textMuted};">${e(course.institution)} &#8226; ${e(course.year)}</span>
                </div>
            `).join('')}
        </div>
    ` : '';

    // ---- AWARDS ----
    const awardsHtml = data.awards && data.awards.length > 0 ? `
        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 12px; border-bottom: 1px solid ${theme.border}; padding-bottom: 8px;">
                ${rt('awards')}
            </h2>
            <ul style="margin: 0; padding: 0; list-style: none;">
                ${data.awards.map(award => `
                    <li class="cv-item" style="font-size: 12px; color: ${theme.text}; margin-bottom: 4px; display: flex; gap: 8px;">
                        <span style="color: ${theme.primary};">&#8226;</span>
                        <span>${e(award)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    // Skills as pill tags (matching React template)
    const skillsLanguagesHtml = (data.skills.length > 0 || data.languages.length > 0) ? `
        <div class="cv-section-small" style="display: flex; gap: 32px;">
            ${data.skills.length > 0 ? `
                <div style="flex: 1;">
                    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 12px; border-bottom: 1px solid ${theme.border}; padding-bottom: 8px;">
                        ${rt('skills')}
                    </h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${data.skills.map(skill => `
                            <span style="font-size: 12px; padding: 4px 12px; border-radius: 9999px; background-color: ${theme.primary}10; color: ${theme.primary};">
                                ${e(skill.name)}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${data.languages.length > 0 ? `
                <div style="flex: 1;">
                    <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 12px; border-bottom: 1px solid ${theme.border}; padding-bottom: 8px;">
                        ${rt('languages')}
                    </h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${data.languages.map(lang => `
                            <span style="font-size: 12px; padding: 4px 12px; border-radius: 9999px; background-color: ${theme.secondary}10; color: ${theme.secondary};">
                                ${e(lang.name)} (${e(formatLanguageLevel(lang.level, data))})
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    ` : '';

    const interestsHtml = data.interests && data.interests.length > 0 ? `
        <div class="cv-section-small" style="margin-top: 24px;">
            <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: ${theme.primary}; margin-bottom: 12px; border-bottom: 1px solid ${theme.border}; padding-bottom: 8px;">
                ${rt('interests')}
            </h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${data.interests.map(interest => `
                    <span style="font-size: 12px; padding: 4px 12px; border-radius: 9999px; background-color: ${theme.primary}08; color: ${theme.text};">
                        ${e(interest)}
                    </span>
                `).join('')}
            </div>
        </div>
    ` : '';

    const content = `
        <div style="background-color: white; min-height: 297mm; width: 210mm; margin: 0 auto; padding: 40px; color: ${theme.text};">
            ${headerHtml}
            ${summaryHtml}
            ${experienceHtml}
            ${internshipsHtml}
            ${educationHtml}
            ${coursesHtml}
            ${awardsHtml}
            ${skillsLanguagesHtml}
            ${interestsHtml}
        </div>
    `;

    return wrapPage(content, theme, getResumeLanguage(data));
}

// ============================================================
// ATS BUILDER (kept as-is - designed to be plain text for ATS)
// ============================================================

function buildATSHTML(data: CVData, theme: ColorTheme): string {
    const e = escapeHtml;
    const rt = (key: Parameters<typeof resumeText>[1]) => resumeText(data, key);

    const headerHtml = `
        <div style="text-align: center; border-bottom: 2px solid ${theme.primary}; padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 4px 0; color: ${theme.text};">
                ${e(data.personal.name || rt('nameFallback'))}
            </h1>
            ${data.personal.title ? `<p style="font-size: 14px; margin: 0 0 8px 0; color: ${theme.textMuted};">${e(data.personal.title)}</p>` : ''}
            <div style="font-size: 11px; color: ${theme.textMuted};">
                ${[data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedIn, data.personal.github, data.personal.website].filter(Boolean).map(v => linkifyText(v!)).join(' | ')}
            </div>
        </div>
    `;

    const summaryHtml = data.personal.summary ? `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${theme.primary}; margin-bottom: 6px; border-bottom: 1px solid ${theme.border}; padding-bottom: 4px;">${rt('profile')}</h2>
            <p style="font-size: 11px; line-height: 1.5; color: ${theme.text};">${nl2brLinkified(data.personal.summary)}</p>
        </div>
    ` : '';

    const skillsHtml = data.skills.length > 0 ? `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${theme.primary}; margin-bottom: 6px; border-bottom: 1px solid ${theme.border}; padding-bottom: 4px;">${rt('skills')}</h2>
            <p style="font-size: 11px; line-height: 1.5; color: ${theme.text};">${data.skills.map(s => e(s.name)).join(' &#8226; ')}</p>
        </div>
    ` : '';

    const experienceHtml = data.experience.length > 0 ? `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${theme.primary}; margin-bottom: 8px; border-bottom: 1px solid ${theme.border}; padding-bottom: 4px;">${rt('experience')}</h2>
            ${data.experience.map(exp => `
                <div class="cv-item" style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-weight: bold; font-size: 12px; margin: 0; color: ${theme.text};">${e(exp.role)}</h3>
                        <span style="font-size: 10px; color: ${theme.textMuted};">${e(exp.start)} - ${e(exp.end)}</span>
                    </div>
                    <div style="font-size: 11px; color: ${theme.secondary}; margin-top: 2px;">${e(exp.company)}${exp.location ? ` | ${e(exp.location)}` : ''}</div>
                    ${exp.description ? `<p style="font-size: 10px; margin-top: 4px; line-height: 1.4; color: ${theme.textMuted};">${nl2brLinkified(exp.description)}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `<ul style="margin: 4px 0 0 0; padding-left: 16px;">${exp.highlights.map(h => `<li style="font-size: 10px; color: ${theme.text}; margin-bottom: 2px;">${e(h)}</li>`).join('')}</ul>` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    const internshipsHtml = data.internships && data.internships.length > 0 ? `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${theme.primary}; margin-bottom: 8px; border-bottom: 1px solid ${theme.border}; padding-bottom: 4px;">${rt('internships')}</h2>
            ${data.internships.map(intern => `
                <div class="cv-item" style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-weight: bold; font-size: 12px; margin: 0; color: ${theme.text};">${e(intern.role)}</h3>
                        <span style="font-size: 10px; color: ${theme.textMuted};">${e(intern.start)} - ${e(intern.end)}</span>
                    </div>
                    <div style="font-size: 11px; color: ${theme.secondary}; margin-top: 2px;">${e(intern.company)}${intern.location ? ` | ${e(intern.location)}` : ''}</div>
                    ${intern.description ? `<p style="font-size: 10px; margin-top: 4px; line-height: 1.4; color: ${theme.textMuted};">${nl2brLinkified(intern.description)}</p>` : ''}
                    ${intern.highlights && intern.highlights.length > 0 ? `<ul style="margin: 4px 0 0 0; padding-left: 16px;">${intern.highlights.map(h => `<li style="font-size: 10px; color: ${theme.text}; margin-bottom: 2px;">${e(h)}</li>`).join('')}</ul>` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    const educationHtml = data.education.length > 0 ? `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${theme.primary}; margin-bottom: 8px; border-bottom: 1px solid ${theme.border}; padding-bottom: 4px;">${rt('educationSingle')}</h2>
            ${data.education.map(edu => `
                <div class="cv-item" style="margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-weight: bold; font-size: 11px; margin: 0; color: ${theme.text};">${e(edu.degree)}</h3>
                        <span style="font-size: 10px; color: ${theme.textMuted};">${e(edu.start)} - ${e(edu.end)}</span>
                    </div>
                    <div style="font-size: 10px; color: ${theme.textMuted};">${e(edu.school)}${edu.location ? `, ${e(edu.location)}` : ''}</div>
                    ${edu.description ? `<p style="font-size: 10px; margin-top: 2px; color: ${theme.textMuted};">${e(edu.description)}</p>` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    const awardsHtml = data.awards && data.awards.length > 0 ? `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${theme.primary}; margin-bottom: 6px; border-bottom: 1px solid ${theme.border}; padding-bottom: 4px;">${rt('awards')}</h2>
            <ul style="margin: 0; padding-left: 16px;">${data.awards.map(award => `<li style="font-size: 10px; color: ${theme.text}; margin-bottom: 2px;">${e(award)}</li>`).join('')}</ul>
        </div>
    ` : '';

    const coursesHtml = data.courses && data.courses.length > 0 ? `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${theme.primary}; margin-bottom: 6px; border-bottom: 1px solid ${theme.border}; padding-bottom: 4px;">${rt('courses')}</h2>
            ${data.courses.map(course => `
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                    <span>${e(course.name)}</span>
                    <span style="color: ${theme.textMuted};">${e(course.institution)}${course.year ? ` | ${e(course.year)}` : ''}</span>
                </div>
            `).join('')}
        </div>
    ` : '';

    const languagesHtml = data.languages.length > 0 ? `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${theme.primary}; margin-bottom: 6px; border-bottom: 1px solid ${theme.border}; padding-bottom: 4px;">${rt('languages')}</h2>
            <p style="font-size: 11px; color: ${theme.text};">${data.languages.map(l => `${e(l.name)} (${e(formatLanguageLevel(l.level, data))})`).join(' &#8226; ')}</p>
        </div>
    ` : '';

    const content = `
        <div style="background-color: white; min-height: 297mm; width: 210mm; margin: 0 auto; padding: 32px; color: ${theme.text}; font-family: Arial, sans-serif;">
            ${headerHtml}
            ${summaryHtml}
            ${skillsHtml}
            ${experienceHtml}
            ${internshipsHtml}
            ${educationHtml}
            ${coursesHtml}
            ${awardsHtml}
            ${languagesHtml}
        </div>
    `;

    return wrapPage(content, theme, getResumeLanguage(data));
}

// ============================================================
// PDF GENERATION (unchanged)
// ============================================================

export async function generatePDF(
    data: CVData,
    templateId: string = 'professional',
    colorThemeId: string = 'classic-blue'
): Promise<Buffer> {
    const html = buildHTML(data, templateId, colorThemeId);

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--disable-crash-reporter',
        ],
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            // Let CSS @page control margins so we can keep page 1 unchanged
            // and add breathing room to continued pages.
            preferCSSPageSize: true,
        });

        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
}



