import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatLanguageLevel, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// ATS-Friendly Template - Single column, no graphics, optimized for Applicant Tracking Systems
export default function ATSTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    const contactItems = [
        data.personal.email,
        data.personal.phone,
        data.personal.location,
        data.personal.linkedIn,
        data.personal.github,
        data.personal.website,
    ].filter((item): item is string => Boolean(item));

    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto p-8"
            style={{ color: theme.text, fontFamily: 'Arial, sans-serif' }}
        >
            {/* Header - Name and Contact */}
            <div className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.primary}` }}>
                <NameTag className="text-2xl font-bold uppercase tracking-wide mb-2">
                    {data.personal.name || resumeText(data, "nameFallback")}
                </NameTag>
                {data.personal.title && (
                    <p className="text-base mb-3" style={{ color: theme.textMuted }}>
                        {data.personal.title}
                    </p>
                )}
                {/* Contact info in a single line */}
                <div className="flex flex-wrap justify-center gap-3 text-xs" style={{ color: theme.textMuted }}>
                    {contactItems.map((item, index) => (
                        <span key={`${item}-${index}`}>
                            {index > 0 ? '| ' : ''}<LinkText value={item} />
                        </span>
                    ))}
                </div>
            </div>

            {/* Profile Summary */}
            {data.personal.summary && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "profile")}</h2>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">
                        {data.personal.summary}
                    </p>
                </div>
            )}

            {/* Skills - Plain text format for ATS */}
            {data.skills.length > 0 && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "skills")}</h2>
                    <p className="text-xs leading-relaxed">
                        {data.skills.map(skill => skill.name).join(' • ')}
                    </p>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "experience")}</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-bold">{exp.role}</h3>
                                    <span className="text-xs" style={{ color: theme.textMuted }}>
                                        {exp.start} - {exp.end}
                                    </span>
                                </div>
                                <p className="text-xs font-medium mb-1" style={{ color: theme.secondary }}>
                                    {exp.company}{exp.location && ` | ${exp.location}`}
                                </p>
                                {exp.description && (
                                    <p className="text-xs leading-relaxed mb-1" style={{ color: theme.textMuted }}>
                                        {exp.description}
                                    </p>
                                )}
                                {exp.highlights && exp.highlights.length > 0 && (
                                    <ul className="mt-1 space-y-1 ml-4">
                                        {exp.highlights.map((highlight, hi) => (
                                            <li key={hi} className="text-xs list-disc">
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Internships */}
            {data.internships && data.internships.length > 0 && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "internships")}</h2>
                    <div className="space-y-3">
                        {data.internships.map((intern, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-xs font-bold">{intern.role}</h3>
                                    <span className="text-xs" style={{ color: theme.textMuted }}>
                                        {intern.start} - {intern.end}
                                    </span>
                                </div>
                                <p className="text-xs" style={{ color: theme.secondary }}>
                                    {intern.company}{intern.location && ` | ${intern.location}`}
                                </p>
                                {intern.description && (
                                    <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                                        {intern.description}
                                    </p>
                                )}
                                {intern.highlights && intern.highlights.length > 0 && (
                                    <ul className="mt-1 space-y-1 ml-4">
                                        {intern.highlights.map((highlight, hi) => (
                                            <li key={hi} className="text-xs list-disc">
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "education")}</h2>
                    <div className="space-y-3">
                        {data.education.map((edu, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-xs font-bold">{edu.degree}</h3>
                                    <span className="text-xs" style={{ color: theme.textMuted }}>
                                        {edu.start} - {edu.end}
                                    </span>
                                </div>
                                <p className="text-xs" style={{ color: theme.textMuted }}>
                                    {edu.school}{edu.location && `, ${edu.location}`}
                                </p>
                                {edu.description && (
                                    <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                                        {edu.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Courses/Certifications */}
            {data.courses && data.courses.length > 0 && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "courses")}</h2>
                    <div className="space-y-1">
                        {data.courses.map((course, i) => (
                            <div key={i} className="flex justify-between text-xs">
                                <span>{course.name}</span>
                                <span style={{ color: theme.textMuted }}>
                                    {course.institution}{course.year && ` | ${course.year}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Awards & Achievements */}
            {data.awards && data.awards.length > 0 && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "awards")}</h2>
                    <ul className="space-y-1 ml-4">
                        {data.awards.map((award, i) => (
                            <li key={i} className="text-xs list-disc">
                                {award}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Languages - Plain text */}
            {data.languages.length > 0 && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "languages")}</h2>
                    <p className="text-xs">
                        {data.languages.map(lang => `${lang.name} (${formatLanguageLevel(lang.level, data)})`).join(' • ')}
                    </p>
                </div>
            )}

            {/* Interests */}
            {data.interests && data.interests.length > 0 && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "interests")}</h2>
                    <p className="text-xs">
                        {data.interests.join(' • ')}
                    </p>
                </div>
            )}
        </div>
    );
}



