import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatGender, formatLanguageLevel, formatMaritalStatus, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Skill level indicator (horizontal bars)
function SkillLevel({ level, color }: { level: number; color: string }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((bar) => (
                <div
                    key={bar}
                    className="w-4 h-1.5 rounded-sm"
                    style={{
                        backgroundColor: bar <= level ? color : '#e5e7eb',
                    }}
                />
            ))}
        </div>
    );
}

export default function ClassicalTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto p-10"
            style={{ color: theme.text }}
        >
            {/* Header - Centered */}
            <div className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.primary}` }}>
                {data.personal.photo && (
                    <img
                        src={data.personal.photo}
                        alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                        style={{ border: `3px solid ${theme.primary}` }}
                    />
                )}
                <NameTag className="text-3xl font-bold tracking-wide mb-1">
                    {data.personal.name || resumeText(data, "nameFallback")}
                </NameTag>
                {data.personal.title && (
                    <p className="text-lg" style={{ color: theme.textMuted }}>
                        {data.personal.title}
                    </p>
                )}
                {/* Contact Info Row */}
                <div className="flex justify-center flex-wrap gap-4 mt-3 text-xs" style={{ color: theme.textMuted }}>
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>• {data.personal.phone}</span>}
                    {data.personal.address && <span>• {data.personal.address}</span>}
                    {data.personal.postalCode && <span>• {data.personal.postalCode}</span>}
                    {data.personal.location && <span>• {data.personal.location}</span>}
                </div>
            </div>

            {/* Two column layout for personal details */}
            <div className="grid grid-cols-3 gap-6 mb-6 text-xs" style={{ color: theme.textMuted }}>
                {data.personal.birthDate && (
                    <div>
                        <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "birthDate")}:</span> {data.personal.birthDate}
                        {data.personal.birthPlace && `, ${data.personal.birthPlace}`}
                    </div>
                )}
                {data.personal.nationality && (
                    <div>
                        <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "nationality")}:</span> {data.personal.nationality}
                    </div>
                )}
                {data.personal.driversLicense && (
                    <div>
                        <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "driversLicense")}:</span> {data.personal.driversLicense}
                    </div>
                )}
                {formatGender(data.personal.gender, data) && (
                    <div>
                        <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "gender")}:</span> {formatGender(data.personal.gender, data)}
                    </div>
                )}
                {formatMaritalStatus(data.personal.maritalStatus, data) && (
                    <div>
                        <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "maritalStatus")}:</span> {formatMaritalStatus(data.personal.maritalStatus, data)}
                    </div>
                )}
                {data.personal.linkedIn && (
                    <div>
                        <span className="font-semibold" style={{ color: theme.text }}>LinkedIn:</span> <LinkText value={data.personal.linkedIn} />
                    </div>
                )}
            </div>

            {/* Profile Summary */}
            {data.personal.summary && (
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-2"
                        style={{ color: theme.primary }}
                    >{resumeText(data, "profile")}</h2>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {data.personal.summary}
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
                                    <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
                                        {exp.description}
                                    </p>
                                )}
                                {exp.highlights && exp.highlights.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {exp.highlights.map((highlight, hi) => (
                                            <li key={hi} className="text-xs flex gap-2">
                                                <span style={{ color: theme.primary }}>•</span>
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
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "internships")}</h2>
                    <div className="space-y-3">
                        {data.internships.map((intern, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-sm font-bold">{intern.role}</h3>
                                    <span className="text-xs" style={{ color: theme.textMuted }}>
                                        {intern.start} - {intern.end}
                                    </span>
                                </div>
                                <p className="text-xs font-medium" style={{ color: theme.secondary }}>
                                    {intern.company}{intern.location && ` | ${intern.location}`}
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
                                                <span style={{ color: theme.primary }}>•</span>
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
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "education")}</h2>
                    <div className="space-y-3">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-sm">{edu.degree}</h3>
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
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                    >{resumeText(data, "courses")}</h2>
                    <div className="space-y-1">
                        {data.courses.map((course, i) => (
                            <div key={i} className="flex justify-between text-xs">
                                <span className="font-medium">{course.name}</span>
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
                <div className="mb-5">
                    <h2
                        className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
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

            {/* Skills & Languages & Interests Row */}
            <div className="grid grid-cols-3 gap-6">
                {/* Skills */}
                {data.skills.length > 0 && (
                    <div>
                        <h2
                            className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                        >{resumeText(data, "skills")}</h2>
                        <div className="space-y-2">
                            {data.skills.map((skill, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs">
                                        {typeof skill === 'object' ? skill.name : skill}
                                    </span>
                                    <SkillLevel
                                        level={typeof skill === 'object' ? skill.level : 3}
                                        color={theme.primary}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                    <div>
                        <h2
                            className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                        >{resumeText(data, "languages")}</h2>
                        <div className="space-y-1">
                            {data.languages.map((lang, i) => (
                                <div key={i}>
                                    <div className="text-xs font-medium">
                                        {typeof lang === 'object' ? lang.name : lang}
                                    </div>
                                    {typeof lang === 'object' && lang.level && (
                                        <div className="text-xs" style={{ color: theme.textMuted }}>{formatLanguageLevel(lang.level, data)}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interests */}
                {data.interests && data.interests.length > 0 && (
                    <div>
                        <h2
                            className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}
                        >{resumeText(data, "interests")}</h2>
                        <div className="flex flex-wrap gap-1">
                            {data.interests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{
                                        backgroundColor: `${theme.primary}10`,
                                        color: theme.primary
                                    }}
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}



