import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatGender, formatLanguageLevel, formatMaritalStatus, formatSkillLevel, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Simple skill indicator (text-based)
function SkillLevel({ level, data }: { level: number; data: CVData }) {
    return <span className="text-xs opacity-60">({formatSkillLevel(level, data)})</span>;
}

export default function SimpleTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto p-12"
            style={{ color: theme.text }}
        >
            {/* Header - Left aligned, minimal */}
            <div className="mb-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <NameTag className="text-3xl font-bold mb-1">
                            {data.personal.name || resumeText(data, "nameFallback")}
                        </NameTag>
                        {data.personal.title && (
                            <p className="text-lg" style={{ color: theme.textMuted }}>
                                {data.personal.title}
                            </p>
                        )}
                    </div>
                    {data.personal.photo && (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-16 h-16 rounded-full object-cover"
                            style={{ border: `3px solid ${theme.primary}` }}
                        />
                    )}
                </div>
                {/* Contact inline */}
                <div className="flex flex-wrap gap-3 mt-3 text-xs" style={{ color: theme.textMuted }}>
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>• {data.personal.phone}</span>}
                    {data.personal.address && <span>• {data.personal.address}</span>}
                    {data.personal.postalCode && <span>• {data.personal.postalCode}</span>}
                    {data.personal.location && <span>• {data.personal.location}</span>}
                </div>
            </div>

            {/* Personal details row */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 mb-6 text-xs" style={{ color: theme.textMuted }}>
                {data.personal.birthDate && (
                    <span><strong style={{ color: theme.text }}>{resumeText(data, "birthDateAndPlace")}:</strong> {data.personal.birthDate}{data.personal.birthPlace && `, ${data.personal.birthPlace}`}</span>
                )}
                {data.personal.nationality && (
                    <span><strong style={{ color: theme.text }}>{resumeText(data, "nationality")}:</strong> {data.personal.nationality}</span>
                )}
                {data.personal.driversLicense && (
                    <span><strong style={{ color: theme.text }}>{resumeText(data, "driversLicense")}:</strong> {data.personal.driversLicense}</span>
                )}
                {formatGender(data.personal.gender, data) && (
                    <span><strong style={{ color: theme.text }}>{resumeText(data, "gender")}:</strong> {formatGender(data.personal.gender, data)}</span>
                )}
                {formatMaritalStatus(data.personal.maritalStatus, data) && (
                    <span><strong style={{ color: theme.text }}>{resumeText(data, "maritalStatus")}:</strong> {formatMaritalStatus(data.personal.maritalStatus, data)}</span>
                )}
                {data.personal.linkedIn && (
                    <span><strong style={{ color: theme.text }}>LinkedIn:</strong> <LinkText value={data.personal.linkedIn} /></span>
                )}
            </div>

            {/* Profile Summary */}
            {data.personal.summary && (
                <div className="mb-6">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {data.personal.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="mb-6">
                    <h2
                        className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                        style={{ borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "experience")}</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-sm">{exp.role}</h3>
                                    <span className="text-xs" style={{ color: theme.textMuted }}>
                                        {exp.start} - {exp.end}
                                    </span>
                                </div>
                                <p className="text-xs" style={{ color: theme.textMuted }}>
                                    {exp.company}{exp.location && `, ${exp.location}`}
                                </p>
                                {exp.description && (
                                    <p className="text-xs mt-2 leading-relaxed" style={{ color: theme.textMuted }}>
                                        {exp.description}
                                    </p>
                                )}
                                {exp.highlights && exp.highlights.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {exp.highlights.map((highlight, hi) => (
                                            <li key={hi} className="text-xs flex gap-2">
                                                <span>•</span>
                                                <span>{highlight}</span>
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
                <div className="mb-6">
                    <h2
                        className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                        style={{ borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "internships")}</h2>
                    <div className="space-y-3">
                        {data.internships.map((intern, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-sm">{intern.role}</h3>
                                    <span className="text-xs" style={{ color: theme.textMuted }}>
                                        {intern.start} - {intern.end}
                                    </span>
                                </div>
                                <p className="text-xs" style={{ color: theme.textMuted }}>
                                    {intern.company}{intern.location && `, ${intern.location}`}
                                </p>
                                {intern.description && (
                                    <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                                        {intern.description}
                                    </p>
                                )}
                                {intern.highlights && intern.highlights.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {intern.highlights.map((highlight, hi) => (
                                            <li key={hi} className="text-xs flex gap-2">
                                                <span>•</span>
                                                <span>{highlight}</span>
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
                <div className="mb-6">
                    <h2
                        className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                        style={{ borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "education")}</h2>
                    <div className="space-y-3">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-semibold text-sm">{edu.degree}</h3>
                                    <p className="text-xs" style={{ color: theme.textMuted }}>
                                        {edu.school}{edu.location && `, ${edu.location}`}
                                    </p>
                                    {edu.description && (
                                        <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs" style={{ color: theme.textMuted }}>
                                    {edu.start} - {edu.end}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Courses */}
            {data.courses && data.courses.length > 0 && (
                <div className="mb-6">
                    <h2
                        className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                        style={{ borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "courses")}</h2>
                    <div className="space-y-1">
                        {data.courses.map((course, i) => (
                            <div key={i} className="flex justify-between text-xs">
                                <span>{course.name}</span>
                                <span style={{ color: theme.textMuted }}>
                                    {course.institution} • {course.year}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Awards */}
            {data.awards && data.awards.length > 0 && (
                <div className="mb-6">
                    <h2
                        className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                        style={{ borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "awards")}</h2>
                    <ul className="space-y-1">
                        {data.awards.map((award, i) => (
                            <li key={i} className="text-xs flex items-start gap-2">
                                <span style={{ color: theme.primary }}>•</span>
                                <span>{award}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Skills, Languages & Interests */}
            <div className="grid grid-cols-3 gap-8">
                {data.skills.length > 0 && (
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                            style={{ borderBottom: `1px solid ${theme.border}` }}
                        >{resumeText(data, "skills")}</h2>
                        <ul className="space-y-1 text-xs">
                            {data.skills.map((skill, i) => (
                                <li key={i} className="flex justify-between items-center">
                                    <span>{typeof skill === 'object' ? skill.name : skill}</span>
                                    {typeof skill === 'object' && (
                                        <SkillLevel level={skill.level} data={data} />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {data.languages.length > 0 && (
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                            style={{ borderBottom: `1px solid ${theme.border}` }}
                        >{resumeText(data, "languages")}</h2>
                        <ul className="space-y-1 text-xs">
                            {data.languages.map((lang, i) => (
                                <li key={i}>
                                    {typeof lang === 'object' ? (
                                        <span>{lang.name} <span className="opacity-60">({formatLanguageLevel(lang.level, data)})</span></span>
                                    ) : lang}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {data.interests && data.interests.length > 0 && (
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-3 pb-2"
                            style={{ borderBottom: `1px solid ${theme.border}` }}
                        >{resumeText(data, "interests")}</h2>
                        <p className="text-xs">
                            {data.interests.join(', ')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}



