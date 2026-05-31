"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { CVData } from "@/lib/cv";
import { updateCV, updateCVTemplate, updateCVColorTheme, getCheckoutURL } from "../actions";
import Preview from "./preview";
import {
    ExperienceSection,
    EducationSection,
    SkillsSection,
    LanguagesSection,
    InternshipsSection,
    InterestsSection,
    PropertiesSection,
    CoursesSection,
    AwardsSection,
    ReferencesSection,
    SideActivitiesSection,
    CustomSectionsSection
} from "./sections";
import TemplateSelector from "./TemplateSelector";
import ColorThemePicker from "./ColorThemePicker";
import CVUploader from "./CVUploader";
import WelcomeOnboarding from "./WelcomeOnboarding";
import CvScoreWidget from "./CvScoreWidget";
import KeywordScannerWidget from "./KeywordScannerWidget";
import PhotoUpload from "./PhotoUpload";
import { cvDownloadPrice } from "@/lib/site-content";
import {
    hasCompletionTracked,
    hasEditorStartedTracked,
    markCompletionTracked,
    markEditorStartedTracked,
    track
} from "@/lib/analytics";
import { UiLanguage } from "@/lib/ui-language";

interface EditorProps {
    initialData: CVData;
    id: string;
    initialTemplateId: string;
    initialColorThemeId: string;
    uiLanguage?: UiLanguage;
}

// Reusable input styles for cleaner, calmer form UI
const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
const inputStyle = undefined;
const DESKTOP_PREVIEW_SCALE = 0.58;
const MOBILE_PREVIEW_SCALE = 0.44;
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

type CoverLetterTone = 'professional' | 'enthusiastic' | 'concise';
type AtsLanguageLock = 'auto' | 'nl' | 'en';
type CheckoutModalCloseReason = 'later_button' | 'close_button' | 'overlay';
type OptionalSectionId =
    | 'internships'
    | 'courses'
    | 'awards'
    | 'interests'
    | 'properties'
    | 'references'
    | 'sideActivities'
    | 'customSections';

function getOptionalSectionOptions(uiLanguage: UiLanguage): Array<{ id: OptionalSectionId; label: string }> {
    if (uiLanguage === "en") {
        return [
            { id: "interests", label: "Interests" },
            { id: "properties", label: "Strengths" },
            { id: "courses", label: "Courses/Certificates" },
            { id: "internships", label: "Internships" },
            { id: "awards", label: "Achievements" },
            { id: "references", label: "References" },
            { id: "sideActivities", label: "Side Activities" },
            { id: "customSections", label: "Custom Section" },
        ];
    }

    return [
        { id: "interests", label: "Interesses" },
        { id: "properties", label: "Eigenschappen" },
        { id: "courses", label: "Cursussen/Certificaten" },
        { id: "internships", label: "Stages" },
        { id: "awards", label: "Prestaties" },
        { id: "references", label: "Referenties" },
        { id: "sideActivities", label: "Nevenactiviteiten" },
        { id: "customSections", label: "Eigen onderdeel" },
    ];
}

function hasItems(value: unknown): boolean {
    return Array.isArray(value) && value.length > 0;
}

function ensureEditorData(data: CVData, fallbackLanguage: UiLanguage = "nl"): CVData {
    return {
        ...data,
        personal: {
            ...data.personal,
            resumeLanguage: data.personal.resumeLanguage ?? fallbackLanguage,
        },
        references: data.references ?? [],
        sideActivities: data.sideActivities ?? [],
        customSections: data.customSections ?? [],
        properties: data.properties ?? [],
    };
}

function deriveVisibleOptionalSections(data: CVData): Record<OptionalSectionId, boolean> {
    return {
        internships: hasItems(data.internships),
        courses: hasItems(data.courses),
        awards: hasItems(data.awards),
        interests: hasItems(data.interests),
        properties: hasItems(data.properties),
        references: hasItems(data.references),
        sideActivities: hasItems(data.sideActivities),
        customSections: hasItems(data.customSections),
    };
}

function getCompletionScore(data: CVData): number {
    let score = 0;
    if (data.personal.name) score += 20;
    if (data.personal.email) score += 10;
    if (data.personal.phone) score += 10;
    if (data.personal.summary && data.personal.summary.length > 80) score += 20;
    if (data.experience.length > 0) score += 20;
    if (data.education.length > 0) score += 10;
    if (data.skills.length >= 3) score += 10;
    return Math.min(score, 100);
}

function getCheckoutFailureReason(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message.slice(0, 160);
    }
    return "unknown";
}

export default function Editor({
    initialData,
    id,
    initialTemplateId,
    initialColorThemeId,
    uiLanguage = "nl",
}: EditorProps) {
    const isEnglish = uiLanguage === "en";
    const tr = (dutch: string, english: string) => (isEnglish ? english : dutch);
    const normalizedInitialData = ensureEditorData(initialData, uiLanguage);
    const optionalSectionOptions = getOptionalSectionOptions(uiLanguage);
    const genderOptions = [
        { value: "", label: tr("Selecteer...", "Select...") },
        { value: "Man", label: tr("Man", "Male") },
        { value: "Vrouw", label: tr("Vrouw", "Female") },
        { value: "Anders", label: tr("Anders", "Other") },
    ];
    const maritalStatusOptions = [
        { value: "", label: tr("Selecteer...", "Select...") },
        { value: "Ongehuwd", label: tr("Ongehuwd", "Single") },
        { value: "Gehuwd", label: tr("Gehuwd", "Married") },
        { value: "Samenwonend", label: tr("Samenwonend", "Cohabiting") },
        { value: "Gescheiden", label: tr("Gescheiden", "Divorced") },
    ];
    const coverLetterToneOptions: Array<{ value: CoverLetterTone; label: string }> = [
        { value: "professional", label: tr("Professioneel", "Professional") },
        { value: "enthusiastic", label: tr("Enthousiast", "Enthusiastic") },
        { value: "concise", label: tr("Bondig", "Concise") },
    ];
    const checkoutBenefits = isEnglish
        ? [
            `One-time ${cvDownloadPrice.display.replace(",", ".")} payment for this CV`,
            "No subscription or automatic renewal",
            "You only pay for this PDF download",
            "Edit this CV later and re-download it for free",
            "Professional PDF available immediately",
        ]
        : [
            `Eenmalig ${cvDownloadPrice.display} voor dit CV`,
            "Geen abonnement of automatische verlenging",
            "Je betaalt alleen voor deze PDF-download",
            "Dit CV later gratis aanpassen en opnieuw downloaden",
            "Professionele PDF direct beschikbaar",
        ];
    const supportNotifiedMessage = tr(
        "We hebben een technisch probleem aan onze kant gedetecteerd. Ons team is op de hoogte en bekijkt dit zo snel mogelijk. Als het nodig is, nemen we contact op via je e-mailadres.",
        "We hit a technical issue on our side. Our team has been notified and will review it shortly. If needed, we will contact you at your email address."
    );
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { isSubmitting },
    } = useForm<CVData>({
        defaultValues: normalizedInitialData,
    });

    const data = watch();
    const completionScore = getCompletionScore(data);
    const isReadyToDownload = completionScore >= 70;
    const [isSaved, setIsSaved] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [templateId, setTemplateId] = useState(initialTemplateId);
    const [colorThemeId, setColorThemeId] = useState(initialColorThemeId);
    const [showUploader, setShowUploader] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [desktopPreviewScale, setDesktopPreviewScale] = useState(DESKTOP_PREVIEW_SCALE);
    const [mobilePreviewScale, setMobilePreviewScale] = useState(MOBILE_PREVIEW_SCALE);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showTemplateHint, setShowTemplateHint] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [visibleOptionalSections, setVisibleOptionalSections] = useState<Record<OptionalSectionId, boolean>>(
        () => deriveVisibleOptionalSections(normalizedInitialData)
    );
    const [isCheckoutRedirecting, setIsCheckoutRedirecting] = useState(false);
    const [isAtsRewriting, setIsAtsRewriting] = useState(false);
    const [atsTargetRole, setAtsTargetRole] = useState(initialData.personal.title || '');
    const [atsJobDescription, setAtsJobDescription] = useState('');
    const [atsLanguageLock, setAtsLanguageLock] = useState<AtsLanguageLock>('auto');
    const [coverLetter, setCoverLetter] = useState('');
    const [coverLetterUpdatedAt, setCoverLetterUpdatedAt] = useState<string | null>(null);
    const [coverLetterCompanyName, setCoverLetterCompanyName] = useState('');
    const [coverLetterJobDescription, setCoverLetterJobDescription] = useState('');
    const [coverLetterTone, setCoverLetterTone] = useState<CoverLetterTone>('professional');
    const [isCoverLetterLoading, setIsCoverLetterLoading] = useState(true);
    const [isCoverLetterGenerating, setIsCoverLetterGenerating] = useState(false);
    const [isCoverLetterSaving, setIsCoverLetterSaving] = useState(false);
    const [isCoverLetterDirty, setIsCoverLetterDirty] = useState(false);
    const desktopPreviewViewportRef = useRef<HTMLDivElement>(null);
    const mobilePreviewViewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('upload') === '1') {
            setShowUploader(true);
        }
    }, []);

    const handlePageCountChange = useCallback((count: number) => {
        setPageCount(count);
    }, []);

    useEffect(() => {
        const computeScale = (
            el: HTMLDivElement | null,
            minScale: number,
            maxScale: number,
            setter: (value: number) => void
        ) => {
            if (!el) return;
            const width = Math.max(0, el.clientWidth - 32);
            const fitScale = width / A4_WIDTH_PX;
            const clamped = Math.max(minScale, Math.min(maxScale, fitScale));
            if (Number.isFinite(clamped)) {
                setter(clamped);
            }
        };

        const recalc = () => {
            computeScale(desktopPreviewViewportRef.current, 0.5, 0.9, setDesktopPreviewScale);
            computeScale(mobilePreviewViewportRef.current, 0.36, 0.65, setMobilePreviewScale);
        };

        recalc();

        const observer = new ResizeObserver(recalc);
        if (desktopPreviewViewportRef.current) observer.observe(desktopPreviewViewportRef.current);
        if (mobilePreviewViewportRef.current) observer.observe(mobilePreviewViewportRef.current);

        return () => observer.disconnect();
    }, [showMobilePreview]);

    // Show onboarding for empty CVs on first visit
    useEffect(() => {
        const dismissed = localStorage.getItem('werkcv-onboarding-dismissed');
        const isEmpty = initialData.personal.name === '' &&
            initialData.personal.email === '' &&
            initialData.experience.length === 0 &&
            initialData.education.length === 0;
        if (!dismissed && isEmpty) {
            setShowOnboarding(true);
            track('onboarding_shown', {});
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (hasEditorStartedTracked(id)) return;

        let fromPath: string | undefined;
        if (typeof document !== 'undefined' && document.referrer) {
            try {
                const referrerUrl = new URL(document.referrer);
                if (referrerUrl.origin === window.location.origin) {
                    fromPath = referrerUrl.pathname;
                }
            } catch {
                // Ignore malformed referrers.
            }
        }

        track('editor_started', { cvId: id, fromPath });
        markEditorStartedTracked(id);
    }, [id]);

    useEffect(() => {
        if (!showCheckoutModal) return;
        track('checkout_modal_viewed', { cvId: id, source: 'pdf_download' });
        track('checkout_option_viewed', {
            cvId: id,
            product: "cv-download",
            amountCents: cvDownloadPrice.amountCents,
            uiLanguage,
            recommended: true,
        });
    }, [showCheckoutModal, id, uiLanguage]);

    useEffect(() => {
        let cancelled = false;

        const loadCoverLetter = async () => {
            setIsCoverLetterLoading(true);
            try {
                const response = await fetch(`/api/cover-letter?cvId=${encodeURIComponent(id)}`);
                if (!response.ok) {
                    // If payment/add-on is missing we keep editor usable and only gate on generate/save actions.
                    setCoverLetter('');
                    setCoverLetterUpdatedAt(null);
                    return;
                }
                const result = await response.json().catch(() => null);
                if (cancelled) return;
                setCoverLetter(typeof result?.coverLetter === 'string' ? result.coverLetter : '');
                setCoverLetterUpdatedAt(typeof result?.updatedAt === 'string' ? result.updatedAt : null);
                setIsCoverLetterDirty(false);
            } finally {
                if (!cancelled) {
                    setIsCoverLetterLoading(false);
                }
            }
        };

        loadCoverLetter();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleDismissOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem('werkcv-onboarding-dismissed', 'true');
        track('onboarding_dismissed', { action: 'start_typing' });
        // Show template hint after dismissing
        setShowTemplateHint(true);
        setTimeout(() => setShowTemplateHint(false), 5000);
    };

    const handleOnboardingUpload = () => {
        setShowOnboarding(false);
        localStorage.setItem('werkcv-onboarding-dismissed', 'true');
        track('onboarding_dismissed', { action: 'upload_cv' });
        setShowUploader(true);
    };

    const handlePhotoChange = useCallback((base64: string) => {
        setValue('personal.photo', base64, { shouldDirty: true });
        setIsSaved(false);
    }, [setValue]);

    const maybeTrackCompletion = useCallback((cvData: CVData) => {
        if (hasCompletionTracked(id)) return;
        const score = getCompletionScore(cvData);
        if (score < 70) return;
        track('complete_cv', { cvId: id, completionScore: score });
        markCompletionTracked(id);
    }, [id]);

    const toggleOptionalSection = (sectionId: OptionalSectionId) => {
        setVisibleOptionalSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const onSubmit = async (formData: CVData) => {
        setIsSaved(false);
        const res = await updateCV(id, formData);
        if (res.success) {
            setIsSaved(true);
            setLastSaved(new Date());
            maybeTrackCompletion(formData);
        } else {
            alert(tr("Er ging iets mis bij het opslaan.", "Something went wrong while saving."));
        }
    };

    // Dirty detection logic + auto-save
    const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSavingRef = useRef(false);

    useEffect(() => {
        const subscription = watch(() => {
            setIsSaved(false);

            // Debounced auto-save: save 3 seconds after last change
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
            autoSaveTimerRef.current = setTimeout(async () => {
                if (isSavingRef.current) return;
                isSavingRef.current = true;
                try {
                    const currentData = watch() as CVData;
                    const res = await updateCV(id, currentData);
                    if (res.success) {
                        setIsSaved(true);
                        setLastSaved(new Date());
                        maybeTrackCompletion(currentData);
                    }
                } finally {
                    isSavingRef.current = false;
                }
            }, 3000);
        });
        return () => {
            subscription.unsubscribe();
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [watch, id, maybeTrackCompletion]);

    // Warn user before closing tab with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isSaved) {
                e.preventDefault();
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSaved]);

    const handleTemplateChange = async (newTemplateId: string, defaultThemeId: string) => {
        track('template_selected', { templateId: newTemplateId, previousId: templateId });
        setTemplateId(newTemplateId);
        setColorThemeId(defaultThemeId);
        await updateCVTemplate(id, newTemplateId);
        await updateCVColorTheme(id, defaultThemeId);
    };

    const handleColorThemeChange = async (newThemeId: string) => {
        track('color_theme_changed', { themeId: newThemeId, templateId });
        setColorThemeId(newThemeId);
        await updateCVColorTheme(id, newThemeId);
    };

    const handleCVParsed = (data: CVData) => {
        const normalizedData = ensureEditorData(data, uiLanguage);
        // Reset the form with the parsed CV data
        reset(normalizedData);
        setVisibleOptionalSections(deriveVisibleOptionalSections(normalizedData));
        setShowUploader(false);
        setIsSaved(false);
        track('cv_uploaded', { fileType: 'parsed' });
    };

    const startCheckout = async () => {
        setIsCheckoutRedirecting(true);
        const checkoutProduct = "cv-download";
        const amountCents = cvDownloadPrice.amountCents;
        track('checkout_start', { cvId: id, product: checkoutProduct, amountCents });
        try {
            const checkoutResult = await getCheckoutURL(id, undefined, [], checkoutProduct);
            if (!checkoutResult.ok) {
                track('checkout_failed', {
                    cvId: id,
                    reason: checkoutResult.reason || checkoutResult.code,
                    product: checkoutProduct,
                });
                alert(checkoutResult.supportNotified ? supportNotifiedMessage : tr(
                    "Betaling kon niet gestart worden. Controleer de betaalconfiguratie en probeer opnieuw.",
                    "Payment could not be started. Check the payment configuration and try again."
                ));
                setIsCheckoutRedirecting(false);
                return;
            }
            track('checkout_started', { cvId: id, product: checkoutProduct, amountCents });
            window.location.href = checkoutResult.url;
        } catch (error) {
            track('checkout_failed', { cvId: id, reason: getCheckoutFailureReason(error), product: checkoutProduct });
            alert(tr("Betaling kon niet gestart worden. Controleer de betaalconfiguratie en probeer opnieuw.", "Payment could not be started. Check the payment configuration and try again."));
            setIsCheckoutRedirecting(false);
        }
    };

    const handleCheckoutOptionClick = () => {
        const checkoutProduct = "cv-download";
        const amountCents = cvDownloadPrice.amountCents;
        const ctaText = tr(
            `Betaal ${cvDownloadPrice.display} en download PDF`,
            `Pay ${cvDownloadPrice.display.replace(",", ".")} and download PDF`
        );
        track('checkout_option_clicked', {
            cvId: id,
            product: checkoutProduct,
            amountCents,
            uiLanguage,
            recommended: true,
            ctaText,
        });
        startCheckout();
    };

    const closeCheckoutModal = (reason: CheckoutModalCloseReason) => {
        if (isCheckoutRedirecting) return;
        track('checkout_modal_closed', { cvId: id, reason });
        setShowCheckoutModal(false);
    };

    const handleAtsRewrite = async () => {
        setIsAtsRewriting(true);
        try {
            const targetRole = atsTargetRole.trim() || data.personal.title || '';
            const response = await fetch('/api/ats-rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvId: id,
                    targetRole,
                    jobDescription: atsJobDescription,
                    preferredLanguage: atsLanguageLock === 'auto' ? undefined : atsLanguageLock,
                }),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                if (result?.code === 'ATS_LANGUAGE_MISMATCH') {
                    alert(tr("ATS kon de gewenste taal niet betrouwbaar aanhouden. Kies een vaste taal (NL/EN) en probeer opnieuw.", "ATS could not reliably keep the requested language. Choose a fixed language (NL/EN) and try again."));
                    return;
                }
                alert(result?.error || tr("ATS Rewrite mislukt. Probeer het opnieuw.", "ATS rewrite failed. Please try again."));
                return;
            }

            if (result?.data) {
                const rewrittenData = result.data as CVData;
                const currentData = watch() as CVData;
                const normalizedData = ensureEditorData({
                    ...currentData,
                    ...rewrittenData,
                    personal: {
                        ...currentData.personal,
                        ...rewrittenData.personal,
                    },
                    references: rewrittenData.references ?? currentData.references,
                    sideActivities: rewrittenData.sideActivities ?? currentData.sideActivities,
                    customSections: rewrittenData.customSections ?? currentData.customSections,
                    properties: rewrittenData.properties ?? currentData.properties,
                }, uiLanguage);
                reset(normalizedData);
                setVisibleOptionalSections((prev) => ({
                    ...prev,
                    internships: prev.internships || hasItems(normalizedData.internships),
                    courses: prev.courses || hasItems(normalizedData.courses),
                    awards: prev.awards || hasItems(normalizedData.awards),
                    interests: prev.interests || hasItems(normalizedData.interests),
                    properties: prev.properties || hasItems(normalizedData.properties),
                    references: prev.references || hasItems(normalizedData.references),
                    sideActivities: prev.sideActivities || hasItems(normalizedData.sideActivities),
                    customSections: prev.customSections || hasItems(normalizedData.customSections),
                }));
                setIsSaved(false);
            }
        } finally {
            setIsAtsRewriting(false);
        }
    };

    const handleGenerateCoverLetter = async () => {
        setIsCoverLetterGenerating(true);
        track('cta_clicked', { location: 'editor_cover_letter', label: coverLetter ? 'regenerate' : 'generate' });
        try {
            const response = await fetch('/api/cover-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvId: id,
                    targetRole: data.personal.title || '',
                    companyName: coverLetterCompanyName,
                    jobDescription: coverLetterJobDescription,
                    tone: coverLetterTone,
                }),
            });

            const result = await response.json().catch(() => null);
            if (!response.ok) {
                alert(result?.error || tr("Sollicitatiebrief genereren mislukt. Probeer het opnieuw.", "Cover letter generation failed. Please try again."));
                return;
            }

            setCoverLetter(typeof result?.coverLetter === 'string' ? result.coverLetter : '');
            setCoverLetterUpdatedAt(typeof result?.updatedAt === 'string' ? result.updatedAt : null);
            setIsCoverLetterDirty(false);
        } finally {
            setIsCoverLetterGenerating(false);
        }
    };

    const handleSaveCoverLetter = async () => {
        if (!isCoverLetterDirty) return;
        setIsCoverLetterSaving(true);
        track('cta_clicked', { location: 'editor_cover_letter', label: 'save' });
        try {
            const response = await fetch('/api/cover-letter', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvId: id,
                    coverLetter,
                }),
            });

            const result = await response.json().catch(() => null);
            if (!response.ok) {
                alert(result?.error || tr("Opslaan van sollicitatiebrief mislukt.", "Saving the cover letter failed."));
                return;
            }

            setCoverLetter(typeof result?.coverLetter === 'string' ? result.coverLetter : coverLetter);
            setCoverLetterUpdatedAt(typeof result?.updatedAt === 'string' ? result.updatedAt : null);
            setIsCoverLetterDirty(false);
        } finally {
            setIsCoverLetterSaving(false);
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        track('pdf_download_started', { cvId: id });
        try {
            // Always save latest data before generating PDF to prevent stale content
            const formData = watch();
            const res = await updateCV(id, formData);
            if (!res.success) {
                alert(tr("Er ging iets mis bij het opslaan.", "Something went wrong while saving."));
                return;
            }
            setIsSaved(true);
            setLastSaved(new Date());
            maybeTrackCompletion(formData);

            // Fetch PDF as blob so we can track completion and handle errors
            const response = await fetch(`/api/pdf?cvId=${id}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                if (errorData?.code === 'PAYMENT_REQUIRED') {
                    setShowCheckoutModal(true);
                } else if (errorData?.code === 'PDF_ERROR') {
                    alert(errorData?.supportNotified
                        ? supportNotifiedMessage
                        : tr("Er ging iets mis bij het genereren van de PDF. Probeer het opnieuw.", "Something went wrong while generating the PDF. Please try again."));
                } else {
                    alert(tr("Er ging iets mis bij het downloaden.", "Something went wrong while downloading."));
                }
                return;
            }

            // Extract filename from Content-Disposition header or use default
            const disposition = response.headers.get('Content-Disposition');
            let filename = 'cv.pdf';
            if (disposition) {
                const match = disposition.match(/filename="?([^";\n]+)"?/);
                if (match) filename = match[1];
            }

            // Trigger download via blob URL
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            track('pdf_download_completed', { cvId: id });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-[#FFFEF9] font-sans text-slate-900 overflow-hidden">
            {/* Left: Editor Form */}
            <div className="flex w-full lg:w-[54%] flex-col border-r-0 lg:border-r border-slate-200 bg-[#FFFEF9] z-10 h-screen">
                {/* Toolbar */}
                <div className="min-h-14 border-b border-slate-200 flex flex-wrap items-center justify-between px-3 sm:px-5 py-2 bg-white/95 backdrop-blur sticky top-0 z-20 gap-2">
                    {/* Left side - Logo and tools */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <Link href="/" className="flex items-center gap-1">
                            <span className="font-semibold text-lg sm:text-xl tracking-tight text-slate-900">
                                Werk<span className="bg-[#4ECDC4] px-1 rounded-sm">CV</span>.nl
                            </span>
                        </Link>
                        <Link
                            href="/mijn-cvs"
                            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title={tr("Mijn CV's", "My CVs")}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {tr("Mijn CV's", "My CVs")}
                        </Link>
                        <div className="hidden sm:block w-px h-6 bg-slate-300" />
                        <div className="relative flex items-center gap-1 sm:gap-2">
                            <TemplateSelector
                                currentTemplateId={templateId}
                                onSelectTemplate={handleTemplateChange}
                                uiLanguage={uiLanguage}
                            />
                            {showTemplateHint && (
                                <div className="absolute top-full left-0 mt-2 bg-emerald-100 border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm z-30 whitespace-nowrap">
                                    {tr("Wissel hier van template", "Switch templates here")}
                                </div>
                            )}
                            <ColorThemePicker
                                templateId={templateId}
                                currentThemeId={colorThemeId}
                                onSelectTheme={handleColorThemeChange}
                            />
                        </div>
                        <div className="hidden xl:block w-px h-6 bg-slate-300" />
                        <button
                            onClick={() => setShowUploader(true)}
                            className="hidden xl:flex px-3 py-1.5 font-semibold text-xs border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors rounded-md items-center gap-1.5"
                           
                            title={tr("Upload je bestaande CV", "Upload your existing CV")}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="hidden lg:inline">{tr("CV Uploaden", "Upload CV")}</span>
                        </button>
                        <button
                            onClick={handleAtsRewrite}
                            disabled={isAtsRewriting}
                            className="hidden xl:flex px-3 py-1.5 font-semibold text-xs border border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 transition-colors rounded-md items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                           
                            title="ATS Rewrite"
                        >
                            <span className="font-black">{isAtsRewriting ? '...' : 'ATS'}</span>
                        </button>
                        <button
                            onClick={handleGenerateCoverLetter}
                            disabled={isCoverLetterGenerating}
                            className="hidden xl:flex px-3 py-1.5 font-semibold text-xs border border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100 transition-colors rounded-md items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                           
                            title={tr("Genereer sollicitatiebrief", "Generate cover letter")}
                        >
                            <span className="font-black">{isCoverLetterGenerating ? '...' : tr('Brief AI', 'Letter AI')}</span>
                        </button>
                    </div>

                    {/* Right side - Save and Download */}
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                {isSaved ? (lastSaved ? <span className="text-green-700">✓ <span className="hidden sm:inline">{tr("Opgeslagen", "Saved")} {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span> : "✓") : <span className="text-orange-600">●<span className="hidden sm:inline"> {tr("Niet opgeslagen", "Not saved")}</span></span>}
                            </div>
                            <button
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting || isSaved}
                                className={`px-3 sm:px-4 py-2 font-semibold text-xs sm:text-sm rounded-md border transition-colors ${isSaved
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                        : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                {isSubmitting ? "..." : isSaved ? "✓" : tr("Opslaan", "Save")}
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="bg-emerald-600 text-white px-3 sm:px-4 py-2 font-semibold text-xs sm:text-sm rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDownloading ? "..." : (
                                    <>
                                        <span className="sm:hidden">{tr("Download", "Download")}</span>
                                        <span className="hidden sm:inline">{tr("Download PDF", "Download PDF")}</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-slate-500">
                            {isReadyToDownload && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-800">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    {tr("Klaar voor PDF", "Ready for PDF")}
                                </span>
                            )}
                            <span>{tr("Gratis bewerken, betaal alleen bij downloaden.", "Edit for free, pay only when downloading.")}</span>
                        </div>
                    </div>
                </div>

                {/* Secondary action row - prevents crowded toolbar wrapping on narrow editor panes */}
                <div className="xl:hidden flex gap-2 px-4 py-3 bg-white border-b border-slate-200">
                    <button
                        onClick={() => setShowUploader(true)}
                        className="flex-1 px-3 py-2 font-semibold text-xs rounded-md border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                       
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {tr("Upload bestaand CV", "Upload existing CV")}
                    </button>
                    <button
                        onClick={handleAtsRewrite}
                        disabled={isAtsRewriting}
                        className="px-3 py-2 font-semibold text-xs rounded-md border border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                       
                    >
                        {isAtsRewriting ? '...' : 'ATS'}
                    </button>
                    <button
                        onClick={handleGenerateCoverLetter}
                        disabled={isCoverLetterGenerating}
                        className="px-3 py-2 font-semibold text-xs rounded-md border border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                       
                    >
                        {isCoverLetterGenerating ? '...' : tr('Brief AI', 'Letter AI')}
                    </button>
                </div>

                {isReadyToDownload && !showCheckoutModal && (
                    <div className="md:hidden border-b border-emerald-200 bg-emerald-50/80 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900">{tr("Je CV is klaar om te downloaden.", "Your CV is ready to download.")}</p>
                                <p className="text-[11px] font-medium text-slate-600">
                                    {tr("Gratis bewerken, betaal pas als je de PDF wilt downloaden.", "Edit for free, only pay when you want the PDF.")}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="shrink-0 rounded-md border border-emerald-700 bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDownloading ? "..." : tr("Download", "Download")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 scroll-smooth bg-[#FFFEF9]">
                    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 pb-12">

                        {/* CV Score Widget */}
                        <CvScoreWidget data={data} uiLanguage={uiLanguage} />

                        {/* Keyword Scanner Widget */}
                        <KeywordScannerWidget data={data} uiLanguage={uiLanguage} />

                        {/* Personal Section */}
                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md">
                                    {tr("Persoonlijke Gegevens", "Personal Details")}
                                </span>
                            </h2>

                            {/* Photo Upload + Name/Title */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
                                <PhotoUpload
                                    currentPhoto={data.personal.photo}
                                    onPhotoChange={handlePhotoChange}
                                    uiLanguage={uiLanguage}
                                />
                                <div className="flex-1 grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Volledige Naam", "Full Name")}</label>
                                        <input {...register("personal.name")} placeholder={tr("bv. Simone van Roodenburg", "e.g. Emma Johnson")} className={inputClass} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Gewenste Functie", "Target Role")}</label>
                                        <input {...register("personal.title")} placeholder={tr("bv. Leerkracht Basisonderwijs", "e.g. Primary School Teacher")} className={inputClass} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("CV taal", "CV language")}</label>
                                        <select {...register("personal.resumeLanguage")} className={inputClass} style={inputStyle}>
                                            <option value="nl">{tr("Nederlands", "Dutch")}</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 rounded-xl border-2 border-black bg-[#FFFEF9] p-4 text-sm text-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-black text-black">
                                            {tr("Maak je sollicitatieprofiel compleet", "Complete your application profile")}
                                        </p>
                                        <p className="mt-1 font-medium leading-relaxed text-slate-700">
                                            {tr(
                                                "Geen goede foto? Maak een professionele AI-profielfoto voor je CV en LinkedIn.",
                                                "No good photo? Create a professional AI profile photo for your CV and LinkedIn."
                                            )}
                                        </p>
                                    </div>
                                    <Link
                                        href={isEnglish ? "/en/profile-photo" : "/profielfoto-cv-maken"}
                                        className="inline-flex shrink-0 items-center justify-center border-2 border-black bg-[#4ECDC4] px-4 py-2 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {tr("Maak profielfoto €9,99", "Create profile photo €9.99")}
                                    </Link>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Email</label>
                                    <input {...register("personal.email")} placeholder="email@voorbeeld.nl" className={inputClass} style={inputStyle} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Telefoonnummer", "Phone number")}</label>
                                    <input {...register("personal.phone")} placeholder={tr("06 12345678", "+31 6 12345678")} className={inputClass} style={inputStyle} />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Adres", "Address")}</label>
                                    <input {...register("personal.address")} placeholder={tr("bv. Wilhelminastraat 78", "e.g. Wilhelminastraat 78")} className={inputClass} style={inputStyle} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Postcode & Plaats", "Postal code & city")}</label>
                                    <input {...register("personal.postalCode")} placeholder="1234 AB Utrecht" className={inputClass} style={inputStyle} />
                                </div>
                            </div>

                            {/* Personal Details */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Geboortedatum", "Date of birth")}</label>
                                    <input {...register("personal.birthDate")} placeholder="15-03-1994" className={inputClass} style={inputStyle} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Geboorteplaats", "Place of birth")}</label>
                                    <input {...register("personal.birthPlace")} placeholder="Naarden" className={inputClass} style={inputStyle} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Nationaliteit", "Nationality")}</label>
                                    <input {...register("personal.nationality")} placeholder={tr("Nederlandse", "Dutch")} className={inputClass} style={inputStyle} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Rijbewijs", "Driver's license")}</label>
                                    <input {...register("personal.driversLicense")} placeholder="B" className={inputClass} style={inputStyle} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Geslacht", "Gender")}</label>
                                    <select {...register("personal.gender")} className={inputClass} style={inputStyle}>
                                        {genderOptions.map((option) => (
                                            <option key={option.value || "empty"} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Burgerlijke staat", "Marital status")}</label>
                                    <select {...register("personal.maritalStatus")} className={inputClass} style={inputStyle}>
                                        {maritalStatusOptions.map((option) => (
                                            <option key={option.value || "empty"} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">LinkedIn</label>
                                    <input {...register("personal.linkedIn")} placeholder={tr("linkedin.com/in/naam", "linkedin.com/in/name")} className={inputClass} style={inputStyle} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">GitHub</label>
                                    <input {...register("personal.github")} placeholder="github.com/username" className={inputClass} style={inputStyle} />
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Persoonlijk Profiel", "Personal Profile")}</label>
                                <textarea {...register("personal.summary")} placeholder={tr("Korte introductie over jezelf, je ervaring en wat je zoekt...", "Short introduction about yourself, your experience, and what you are looking for...")} className={`${inputClass} h-28`} style={inputStyle} />
                            </div>
                        </section>

                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                                    {tr("ATS Optimalisatie", "ATS Optimization")}
                                </span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Doelrol", "Target role")}</label>
                                    <input
                                        value={atsTargetRole}
                                        onChange={(e) => setAtsTargetRole(e.target.value)}
                                        placeholder={data.personal.title || tr("bv. Backend Developer", "e.g. Backend Developer")}
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Taal lock", "Language lock")}</label>
                                    <select
                                        value={atsLanguageLock}
                                        onChange={(e) => setAtsLanguageLock(e.target.value as AtsLanguageLock)}
                                        className={inputClass}
                                        style={inputStyle}
                                    >
                                        <option value="auto">{tr("Auto (detecteer)", "Auto (detect)")}</option>
                                        <option value="nl">{tr("Nederlands", "Dutch")}</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Vacaturetekst (optioneel)", "Job description (optional)")}</label>
                                <textarea
                                    value={atsJobDescription}
                                    onChange={(e) => setAtsJobDescription(e.target.value)}
                                    placeholder={tr("Plak de vacaturetekst voor sterkere ATS-keyword match...", "Paste the job description for a stronger ATS keyword match...")}
                                    className={`${inputClass} h-24`}
                                    style={inputStyle}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAtsRewrite}
                                    disabled={isAtsRewriting}
                                    className="px-4 py-2 rounded-md border border-sky-300 bg-sky-50 text-sky-900 font-semibold text-xs hover:bg-sky-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isAtsRewriting ? tr('Bezig...', 'Working...') : tr('ATS herschrijven', 'Rewrite for ATS')}
                                </button>
                                <p className="text-xs font-bold text-gray-600">
                                    {tr("Herschrijft profiel + werkervaring met taalbehoud.", "Rewrites your profile and experience while keeping the selected language.")}
                                </p>
                            </div>
                        </section>

                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                                        {tr("Sollicitatiebrief AI", "Cover Letter AI")}
                                    </span>
                                </h2>
                                {coverLetterUpdatedAt && (
                                    <span className="text-[11px] font-bold text-gray-600">
                                        {tr("Bijgewerkt", "Updated")}: {new Date(coverLetterUpdatedAt).toLocaleString(isEnglish ? "en-NL" : "nl-NL")}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Bedrijfsnaam (optioneel)", "Company name (optional)")}</label>
                                    <input
                                        value={coverLetterCompanyName}
                                        onChange={(e) => setCoverLetterCompanyName(e.target.value)}
                                        placeholder={tr("bv. ASML", "e.g. ASML")}
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Toon", "Tone")}</label>
                                    <select
                                        value={coverLetterTone}
                                        onChange={(e) => setCoverLetterTone(e.target.value as CoverLetterTone)}
                                        className={inputClass}
                                        style={inputStyle}
                                    >
                                        {coverLetterToneOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Vacaturetekst (optioneel)", "Job description (optional)")}</label>
                                <textarea
                                    value={coverLetterJobDescription}
                                    onChange={(e) => setCoverLetterJobDescription(e.target.value)}
                                    placeholder={tr("Plak hier de vacaturetekst voor betere afstemming...", "Paste the job description here for better alignment...")}
                                    className={`${inputClass} h-24`}
                                    style={inputStyle}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">{tr("Brieftekst", "Letter text")}</label>
                                {isCoverLetterLoading ? (
                                    <div className="border-3 border-black bg-gray-50 px-3 py-4 text-sm font-bold text-gray-600">
                                        {tr("Sollicitatiebrief laden...", "Loading cover letter...")}
                                    </div>
                                ) : (
                                    <textarea
                                        value={coverLetter}
                                        onChange={(e) => {
                                            setCoverLetter(e.target.value);
                                            setIsCoverLetterDirty(true);
                                        }}
                                        placeholder={tr("Klik op 'Genereer brief' om je sollicitatiebrief te maken.", "Click 'Generate letter' to create your cover letter.")}
                                        className={`${inputClass} h-56`}
                                        style={inputStyle}
                                    />
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={handleGenerateCoverLetter}
                                    disabled={isCoverLetterGenerating}
                                    className="px-4 py-2 rounded-md border border-rose-300 bg-rose-50 text-rose-900 font-semibold text-xs hover:bg-rose-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isCoverLetterGenerating ? tr('Bezig...', 'Working...') : coverLetter ? tr('Regenereer brief', 'Regenerate letter') : tr('Genereer brief', 'Generate letter')}
                                </button>
                                <button
                                    onClick={handleSaveCoverLetter}
                                    disabled={!isCoverLetterDirty || isCoverLetterSaving}
                                    className="px-4 py-2 rounded-md border border-amber-300 bg-amber-50 text-amber-900 font-semibold text-xs hover:bg-amber-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isCoverLetterSaving ? tr('Opslaan...', 'Saving...') : tr('Brief opslaan', 'Save letter')}
                                </button>
                                <p className="text-xs font-bold text-gray-600">
                                    {tr("Je kunt handmatig aanpassen en opnieuw genereren.", "You can edit it manually and regenerate it at any time.")}
                                </p>
                            </div>
                        </section>

                        <ExperienceSection control={control} register={register} uiLanguage={uiLanguage} />
                        <EducationSection control={control} register={register} uiLanguage={uiLanguage} />
                        <SkillsSection control={control} register={register} uiLanguage={uiLanguage} />
                        <LanguagesSection control={control} register={register} uiLanguage={uiLanguage} />

                        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                                    {tr("Extra onderdelen", "Add Section")}
                                </span>
                            </h2>
                            <p className="text-xs font-bold text-gray-700 mb-4">
                                {tr("Activeer extra onderdelen zoals referenties, nevenactiviteiten of een eigen sectie.", "Enable extra sections such as references, side activities, or a custom section.")}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {optionalSectionOptions.map((option) => {
                                    const isActive = visibleOptionalSections[option.id];
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => toggleOptionalSection(option.id)}
                                            className={`px-3 py-2 text-xs font-semibold rounded-md border transition-colors ${
                                                isActive
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                            }`}
                                        >
                                            {isActive ? '✓ ' : '+ '}
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {visibleOptionalSections.internships && <InternshipsSection control={control} register={register} uiLanguage={uiLanguage} />}
                        {visibleOptionalSections.courses && <CoursesSection control={control} register={register} uiLanguage={uiLanguage} />}
                        {visibleOptionalSections.awards && <AwardsSection control={control} register={register} uiLanguage={uiLanguage} />}
                        {visibleOptionalSections.interests && <InterestsSection control={control} register={register} uiLanguage={uiLanguage} />}
                        {visibleOptionalSections.properties && <PropertiesSection control={control} register={register} uiLanguage={uiLanguage} />}
                        {visibleOptionalSections.references && <ReferencesSection control={control} register={register} uiLanguage={uiLanguage} />}
                        {visibleOptionalSections.sideActivities && <SideActivitiesSection control={control} register={register} uiLanguage={uiLanguage} />}
                        {visibleOptionalSections.customSections && <CustomSectionsSection control={control} register={register} uiLanguage={uiLanguage} />}

                    </div>
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="hidden lg:flex flex-col lg:w-[46%] xl:w-[48%] bg-[#f0faf9] overflow-hidden">
                {/* Fixed header */}
                <div className="shrink-0 flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-600">{tr("Live preview", "Live preview")}</span>
                    <div className="flex items-center gap-2">
                        {pageCount > 1 && (
                            <div className="bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900 border border-amber-300 rounded-md">
                                {pageCount} {tr("pagina's", "pages")}
                            </div>
                        )}
                        <div className="bg-slate-900 px-2 py-1 text-xs font-semibold text-white border border-slate-900 rounded-md">
                            Live
                        </div>
                    </div>
                </div>
                {/* Scrollable preview area */}
                <div
                    ref={desktopPreviewViewportRef}
                    className="flex-1 overflow-y-auto p-4 xl:p-5 flex justify-center items-start"
                >
                    <div
                        className="relative bg-white shadow-sm border border-slate-200"
                        style={{
                            width: A4_WIDTH_PX * desktopPreviewScale,
                            height: pageCount * A4_HEIGHT_PX * desktopPreviewScale,
                        }}
                    >
                        <div
                            style={{
                                transform: `scale(${desktopPreviewScale})`,
                                transformOrigin: 'top left',
                                width: A4_WIDTH_PX,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            }}
                        >
                            <Preview
                                data={data}
                                templateId={templateId}
                                colorThemeId={colorThemeId}
                                onPageCountChange={handlePageCountChange}
                            />
                        </div>
                        {pageCount > 1 && Array.from({ length: pageCount - 1 }, (_, i) => (
                            <div
                                key={i}
                                className="absolute left-0 right-0 z-10 bg-slate-200"
                                style={{ top: (i + 1) * A4_HEIGHT_PX * desktopPreviewScale, height: 6 }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet preview trigger */}
            <button
                type="button"
                onClick={() => setShowMobilePreview(true)}
                className="lg:hidden fixed bottom-4 right-4 z-40 bg-slate-900 text-white px-4 py-2 font-semibold text-xs rounded-md border border-slate-900 shadow-sm"
               
            >
                {tr("Live preview", "Live preview")}{pageCount > 1 ? ` (${pageCount})` : ""}
            </button>

            {/* Mobile/Tablet preview panel */}
            {showMobilePreview && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/50">
                    <button
                        type="button"
                        onClick={() => setShowMobilePreview(false)}
                        className="absolute inset-0 w-full h-full cursor-default"
                        aria-label={tr("Sluit voorbeeld", "Close preview")}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-[72vh] md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[460px] bg-[#f0faf9] border-t md:border-t-0 md:border-l border-slate-300 flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
                            <div className="flex items-center gap-2">
                                <span className="bg-slate-900 px-2 py-1 text-xs font-semibold text-white border border-slate-900 rounded-md">{tr("Live preview", "Live preview")}</span>
                                {pageCount > 1 && (
                                    <span className="bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900 border border-amber-300 rounded-md">{pageCount} {tr("pagina's", "pages")}</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowMobilePreview(false)}
                                className="px-3 py-1 border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                            >
                                {tr("Sluiten", "Close")}
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-4">
                            <div
                                ref={mobilePreviewViewportRef}
                                className="flex justify-center items-start"
                            >
                                <div
                                    className="relative bg-white shadow-sm border border-slate-200"
                                    style={{
                                        width: A4_WIDTH_PX * mobilePreviewScale,
                                        height: pageCount * A4_HEIGHT_PX * mobilePreviewScale,
                                    }}
                                >
                                    <div
                                        style={{
                                            transform: `scale(${mobilePreviewScale})`,
                                            transformOrigin: 'top left',
                                            width: A4_WIDTH_PX,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                        }}
                                    >
                                        <Preview
                                            data={data}
                                            templateId={templateId}
                                            colorThemeId={colorThemeId}
                                            onPageCountChange={handlePageCountChange}
                                        />
                                    </div>
                                    {pageCount > 1 && Array.from({ length: pageCount - 1 }, (_, i) => (
                                        <div
                                            key={i}
                                            className="absolute left-0 right-0 z-10 bg-slate-200"
                                            style={{ top: (i + 1) * A4_HEIGHT_PX * mobilePreviewScale, height: 4 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4"
                    onClick={() => closeCheckoutModal('overlay')}
                >
                    <div
                        className="max-h-[92vh] w-full max-w-md overflow-y-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b-4 border-black bg-[#FFF3BF] px-5 py-5 sm:px-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-black">
                                    {tr("Eenmalige betaling", "One-time payment")}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => closeCheckoutModal('close_button')}
                                    disabled={isCheckoutRedirecting}
                                    className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white text-lg font-black text-black hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                                    aria-label={tr("Sluit betalingsoverzicht", "Close payment summary")}
                                >
                                    ×
                                </button>
                            </div>
                            <h3 className="mt-4 text-2xl font-black text-black sm:text-[2rem]">
                                {tr("Download je cv als PDF", "Download your CV as a PDF")}
                            </h3>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
                                {tr(
                                    `Eenmalig ${cvDownloadPrice.display}. Geen abonnement. Geen automatische verlenging. Je PDF is direct beschikbaar na betaling.`,
                                    `One-time ${cvDownloadPrice.display.replace(",", ".")}. No subscription. No automatic renewal. Your PDF is available immediately after payment.`
                                )}
                            </p>
                        </div>

                        <div className="px-5 py-5 sm:px-6">
                            <div className="mb-5 flex items-end justify-between gap-4 border-2 border-black bg-gray-50 p-4">
                                <div>
                                    <p className="font-black text-black">{tr("CV als PDF", "CV as PDF")}</p>
                                    <p className="text-xs font-semibold text-slate-600">
                                        {tr("Inclusief later opnieuw downloaden", "Includes future re-downloads")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-black">{cvDownloadPrice.display}</p>
                                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-600">
                                        {tr("eenmalig", "one-time")}
                                    </p>
                                </div>
                            </div>

                            <ul className="mb-5 space-y-2.5">
                                {checkoutBenefits.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center border-2 border-black bg-green-300 font-black text-black">
                                            ✓
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mb-5 rounded-md border border-slate-300 bg-white px-3 py-3 text-xs font-semibold text-slate-700">
                                {tr(
                                    "Je betaalt alleen voor deze download. Na betaling kun je ditzelfde cv later opnieuw openen, aanpassen en downloaden zonder opnieuw te betalen.",
                                    "You only pay for this download. After payment, you can reopen, edit, and download this same CV later without paying again."
                                )}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    onClick={() => closeCheckoutModal('later_button')}
                                    disabled={isCheckoutRedirecting}
                                    className="px-4 py-3 border-2 border-black font-bold text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {tr("Nog even bewerken", "Keep editing")}
                                </button>
                                <button
                                    onClick={handleCheckoutOptionClick}
                                    disabled={isCheckoutRedirecting}
                                    className="px-5 py-3 border-2 border-black font-black text-sm bg-yellow-400 hover:bg-yellow-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {isCheckoutRedirecting
                                        ? tr('Bezig...', 'Working...')
                                        : tr(`Betaal ${cvDownloadPrice.display} en download PDF`, `Pay ${cvDownloadPrice.display.replace(",", ".")} and download PDF`)}
                                </button>
                            </div>

                            <p className="mt-3 text-center text-[11px] font-medium text-slate-500">
                                {tr("Veilige betaling via onze betaalpartner.", "Secure payment via our payment partner.")}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* CV Upload Modal */}
            {showUploader && (
                <CVUploader
                    onParsed={handleCVParsed}
                    onClose={() => setShowUploader(false)}
                    uiLanguage={uiLanguage}
                />
            )}

            {/* Welcome Onboarding Modal */}
            {showOnboarding && (
                <WelcomeOnboarding
                    onDismiss={handleDismissOnboarding}
                    onUploadCV={handleOnboardingUpload}
                    uiLanguage={uiLanguage}
                />
            )}
        </div>
    );
}

