import { CVData } from './cv';
import { UiLanguage } from './ui-language';

export interface CvCheck {
    id: string;
    label: string;           // Short label shown in the list
    tip: string;             // Actionable tip shown when failed
    passed: boolean;
    points: number;          // Max points for this check
}

export interface CvScoreResult {
    score: number;           // 0-100
    checks: CvCheck[];
    label: string;           // "Aandacht nodig" | "Verbetering mogelijk" | "Goed op weg" | "Klaar om te versturen"
    color: string;           // Tailwind text color class
    ringColor: string;       // Hex for SVG stroke
}

// Dutch weak verbs — passive phrasing that kills ATS scoring
const WEAK_VERBS = [
    'verantwoordelijk voor',
    'betrokken bij',
    'hielp bij',
    'hielp met',
    'assisteerde',
    'ondersteuning bij',
    'was onderdeel van',
    'was werkzaam',
    'deed mee',
    'had als taak',
];

// Generic buzzwords that add zero value
const BUZZWORDS = [
    'gemotiveerd',
    'passievol',
    'hardwerkend',
    'resultaatgericht',
    'dynamisch',
    'proactief',
    'enthousiast',
    'gedreven',
    'klantgericht',
    'teamspeler',
    'flexibel',
    'hands-on',
];

function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function containsNumber(text: string): boolean {
    // Matches digits, percentages, currency (€/$), ranges like "10-15"
    return /\d/.test(text);
}

function containsWeakVerb(text: string): boolean {
    const lower = text.toLowerCase();
    return WEAK_VERBS.some(v => lower.includes(v));
}

function containsBuzzword(text: string): boolean {
    const lower = text.toLowerCase();
    return BUZZWORDS.some(b => lower.includes(b));
}

export function computeCvScore(data: CVData, uiLanguage: UiLanguage = 'nl'): CvScoreResult {
    const t = (dutch: string, english: string) => uiLanguage === 'en' ? english : dutch;
    const checks: CvCheck[] = [];

    // ─── 1. Naam + contactgegevens (8 pts) ──────────────────────────────────
    const hasContact = !!(
        data.personal.name?.trim() &&
        data.personal.email?.trim() &&
        data.personal.phone?.trim()
    );
    checks.push({
        id: 'contact',
        label: t('Naam, e-mail en telefoon ingevuld', 'Name, email, and phone completed'),
        tip: t('Vul je volledige naam, e-mailadres en telefoonnummer in onder Persoonlijke Gegevens.', 'Add your full name, email address, and phone number under Personal Details.'),
        passed: hasContact,
        points: 8,
    });

    // ─── 2. Functietitel (6 pts) ─────────────────────────────────────────────
    const hasTitle = !!(data.personal.title?.trim());
    checks.push({
        id: 'title',
        label: t('Gewenste functie ingevuld', 'Target role completed'),
        tip: t('Voeg een functietitel toe (bijv. "Marketing Manager") — dit is het eerste wat een recruiter ziet.', 'Add a target role title (for example "Marketing Manager") — it is one of the first things a recruiter sees.'),
        passed: hasTitle,
        points: 6,
    });

    // ─── 3. Profieltekst aanwezig (8 pts) ────────────────────────────────────
    const summary = data.personal.summary ?? '';
    const summaryWords = wordCount(summary);
    const hasSummary = summaryWords >= 20;
    checks.push({
        id: 'summary-present',
        label: t('Profieltekst aanwezig', 'Profile summary present'),
        tip: t('Schrijf een profieltekst van minimaal 3 zinnen die vertelt wie je bent, wat je kunt en wat je zoekt.', 'Write a short profile summary of at least 3 sentences that explains who you are, what you do well, and what you want next.'),
        passed: hasSummary,
        points: 8,
    });

    // ─── 4. Profieltekst ideale lengte (5 pts) ───────────────────────────────
    const summaryIdealLength = summaryWords >= 30 && summaryWords <= 150;
    checks.push({
        id: 'summary-length',
        label: t('Profieltekst ideale lengte (30–150 woorden)', 'Profile summary ideal length (30-150 words)'),
        tip: summaryWords < 30
            ? t('Je profieltekst is te kort. Voeg meer context toe: je sterkste skills, je ervaring in jaren en wat je zoekt.', 'Your profile summary is too short. Add more context: your strongest skills, years of experience, and the type of role you want.')
            : t('Je profieltekst is te lang. Recruiters lezen profielteksten die korter zijn dan 150 woorden vaker volledig.', 'Your profile summary is too long. Recruiters are more likely to read summaries under 150 words all the way through.'),
        passed: summaryIdealLength,
        points: 5,
    });

    // ─── 5. Werkervaring aanwezig (10 pts) ───────────────────────────────────
    const hasExperience = data.experience.length > 0;
    checks.push({
        id: 'experience-present',
        label: t('Minimaal 1 werkervaring vermeld', 'At least 1 experience entry added'),
        tip: t('Voeg je meest recente baan of stage toe onder Werkervaring. Ook korte opdrachten en bijbanen tellen mee.', 'Add your most recent job or internship under Experience. Short projects and part-time roles also count.'),
        passed: hasExperience,
        points: 10,
    });

    // ─── 6. Bullet points per functie (8 pts) ────────────────────────────────
    const entriesWithHighlights = data.experience.filter(
        e => e.highlights && e.highlights.filter(h => h.trim()).length > 0
    );
    const highlightRatio = data.experience.length > 0
        ? entriesWithHighlights.length / data.experience.length
        : 0;
    const hasHighlights = highlightRatio >= 0.5;
    checks.push({
        id: 'highlights',
        label: t('Bullet points toegevoegd per functie', 'Bullet points added per role'),
        tip: t('Voeg bij elke functie minimaal 2 bullet points toe die beschrijven wat je hebt bereikt — niet alleen wat je deed.', 'Add at least 2 bullet points per role that explain what you achieved, not only what you did.'),
        passed: hasHighlights,
        points: 8,
    });

    // ─── 7. Cijfers in bullet points (10 pts) ────────────────────────────────
    const allHighlights = data.experience.flatMap(e => e.highlights ?? []).filter(h => h.trim());
    const highlightsWithNumbers = allHighlights.filter(containsNumber);
    const hasMetrics = allHighlights.length > 0 && highlightsWithNumbers.length > 0;
    checks.push({
        id: 'metrics',
        label: t('Resultaten met cijfers onderbouwd', 'Achievements backed by numbers'),
        tip: t('Voeg getallen toe aan je bullet points: percentages, bedragen, aantallen of tijdsperioden. "Verhoogde verkoop met 23%" overtuigt meer dan "Verbeterde verkoop".', 'Add numbers to your bullet points: percentages, amounts, counts, or time periods. "Increased sales by 23%" is stronger than "Improved sales".'),
        passed: hasMetrics,
        points: 10,
    });

    // ─── 8. Geen zwakke werkwoorden (7 pts) ──────────────────────────────────
    // Only evaluate once there's actual content to check against
    const allHighlightText = allHighlights.join(' ');
    const summaryAndHighlights = `${summary} ${allHighlightText}`;
    const hasEnoughContentToEvaluate = summaryWords >= 10 || allHighlights.length > 0;

    if (hasEnoughContentToEvaluate) {
        const hasWeakVerbs = containsWeakVerb(summaryAndHighlights);
        checks.push({
            id: 'weak-verbs',
            label: t('Geen passieve formuleringen', 'No passive phrasing'),
            tip: t('Vermijd "verantwoordelijk voor", "betrokken bij" en "hielp bij". Gebruik actieve werkwoorden: Geleid, Ontwikkeld, Gerealiseerd, Verhoogd.', 'Avoid passive phrasing like "responsible for" or "helped with". Use active verbs such as Led, Built, Delivered, and Increased.'),
            passed: !hasWeakVerbs,
            points: 7,
        });
    }

    // ─── 9. Geen buzzwords (5 pts) ───────────────────────────────────────────
    if (hasEnoughContentToEvaluate) {
        const hasBuzzwords = containsBuzzword(summaryAndHighlights);
        checks.push({
            id: 'buzzwords',
            label: t('Geen lege buzzwords', 'No empty buzzwords'),
            tip: t('Woorden als "gemotiveerd", "dynamisch" en "resultaatgericht" zeggen niets. Toon het in je werkervaring in plaats van het te claimen.', 'Words like "motivated" and "results-driven" mean little on their own. Show the evidence in your experience instead of claiming it.'),
            passed: !hasBuzzwords,
            points: 5,
        });
    }

    // ─── 10. Vaardigheden aanwezig (8 pts) ───────────────────────────────────
    const hasSkills = data.skills.length >= 3;
    checks.push({
        id: 'skills',
        label: t('Minimaal 3 vaardigheden vermeld', 'At least 3 skills listed'),
        tip: t('Voeg concrete vaardigheden toe: software, tools, technische skills. "Excel (gevorderd)" is beter dan alleen "MS Office".', 'Add concrete skills: software, tools, and technical skills. "Excel (advanced)" is stronger than only writing "MS Office".'),
        passed: hasSkills,
        points: 8,
    });

    // ─── 11. Talen vermeld (5 pts) ───────────────────────────────────────────
    const hasLanguages = data.languages.length > 0;
    checks.push({
        id: 'languages',
        label: t('Talen toegevoegd', 'Languages added'),
        tip: t('Voeg minimaal je moedertaal en het Engels toe onder Talen. Recruiters en ATS-systemen matchen actief op taalniveau.', 'Add at least your native language and English under Languages. Recruiters and ATS systems actively match on language level.'),
        passed: hasLanguages,
        points: 5,
    });

    // ─── 12. Opleiding aanwezig (8 pts) ──────────────────────────────────────
    const hasEducation = data.education.length > 0;
    checks.push({
        id: 'education',
        label: t('Opleiding vermeld', 'Education added'),
        tip: t('Voeg je hoogst genoten opleiding toe. Vermeld ook de instelling en de periode.', 'Add your highest completed education and include the institution and time period.'),
        passed: hasEducation,
        points: 8,
    });

    // ─── 13. LinkedIn URL (5 pts) ────────────────────────────────────────────
    const hasLinkedIn = !!(data.personal.linkedIn?.trim());
    checks.push({
        id: 'linkedin',
        label: t('LinkedIn-URL toegevoegd', 'LinkedIn URL added'),
        tip: t('87% van recruiters bekijkt je LinkedIn naast je CV. Voeg je LinkedIn-URL toe — bij voorkeur een persoonlijke URL (linkedin.com/in/jounaam).', 'Many recruiters check LinkedIn next to your CV. Add your LinkedIn URL, ideally with a clean personal profile link.'),
        passed: hasLinkedIn,
        points: 5,
    });

    // ─── 14. CV niet leeg / voldoende inhoud (7 pts) ─────────────────────────
    const totalWords =
        wordCount(summary) +
        data.experience.reduce((sum, e) => sum + wordCount(e.description) + (e.highlights ?? []).reduce((s, h) => s + wordCount(h), 0), 0) +
        data.education.reduce((sum, e) => sum + wordCount(e.description), 0);
    const hasEnoughContent = totalWords >= 100;
    checks.push({
        id: 'content-volume',
        label: t('Voldoende inhoud (min. 100 woorden)', 'Enough content (min. 100 words)'),
        tip: t('Je CV heeft nog weinig inhoud. Werk je werkervaring en profieltekst verder uit voor een sterkere indruk.', 'Your CV still has limited content. Expand your experience and summary to create a stronger impression.'),
        passed: hasEnoughContent,
        points: 7,
    });

    // ─── Totaalscore ─────────────────────────────────────────────────────────
    const score = checks
        .filter(c => c.passed)
        .reduce((sum, c) => sum + c.points, 0);

    let label: string;
    let color: string;
    let ringColor: string;

    if (score >= 90) {
        label = t('Klaar om te versturen', 'Ready to send');
        color = 'text-emerald-700';
        ringColor = '#10b981';
    } else if (score >= 75) {
        label = t('Goed op weg', 'On the right track');
        color = 'text-teal-600';
        ringColor = '#4ECDC4';
    } else if (score >= 50) {
        label = t('Verbetering mogelijk', 'Room for improvement');
        color = 'text-amber-600';
        ringColor = '#f59e0b';
    } else {
        label = t('Aandacht nodig', 'Needs attention');
        color = 'text-red-600';
        ringColor = '#ef4444';
    }

    return { score, checks, label, color, ringColor };
}
