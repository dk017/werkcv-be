import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Skill level dots component (filled circles)
function SkillDots({ level, color, bgColor = 'rgba(0,0,0,0.15)' }: { level: number; color: string; bgColor?: string }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((dot) => (
                <div
                    key={dot}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                        backgroundColor: dot <= level ? color : bgColor,
                    }}
                />
            ))}
        </div>
    );
}

// Language level bar component
function LanguageBar({ level, color }: { level: string; color: string }) {
    const levelMap: Record<string, number> = {
        'Moedertaal': 100,
        'Vloeiend': 85,
        'Goed': 65,
        'Basis': 35,
    };
    const percentage = levelMap[level] || 50;

    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <div
                className="h-full rounded-full transition-all"
                style={{ width: `${percentage}%`, backgroundColor: color }}
            />
        </div>
    );
}

// Skill bar component (horizontal)
function SkillBar({ level, color }: { level: number; color: string }) {
    const percentage = (level / 5) * 100;
    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <div
                className="h-full rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: color }}
            />
        </div>
    );
}

export default function DynamicTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto"
            style={{ color: theme.text }}
        >
            {/* Header with accent background */}
            <div
                className="px-12 py-8"
                style={{ backgroundColor: theme.primary }}
            >
                <div className="flex items-center gap-6">
                    {/* Photo or initials */}
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-24 h-24 rounded-full object-cover border-4"
                            style={{ borderColor: theme.background }}
                        />
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold border-4"
                            style={{ backgroundColor: theme.background, color: theme.primary, borderColor: theme.background }}
                        >
                            {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                        </div>
                    )}
                    <div className="text-white">
                        <NameTag className="text-3xl font-bold tracking-wide">
                            {data.personal.name || resumeText(data, "nameFallback")}
                        </NameTag>
                        {data.personal.title && (
                            <p className="text-lg mt-1 opacity-90">{data.personal.title}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex min-h-[calc(297mm-120px)]">
                {/* Left Sidebar */}
                <div
                    className="w-[35%] p-6 space-y-5"
                    style={{ backgroundColor: `${theme.primary}10` }}
                >
                    {/* Contact / Personalia */}
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span>◆</span>{resumeText(data, "personalDetails")}</h2>
                        <div className="space-y-2 text-xs" style={{ color: theme.textMuted }}>
                            {data.personal.address && (
                                <div className="flex items-start gap-2">
                                    <span style={{ color: theme.primary }}>⌂</span>
                                    <div>
                                        <div className="font-semibold" style={{ color: theme.text }}>{data.personal.address}</div>
                                        {data.personal.postalCode && <div>{data.personal.postalCode}</div>}
                                    </div>
                                </div>
                            )}
                            {data.personal.email && (
                                <div className="flex items-start gap-2">
                                    <span style={{ color: theme.primary }}>✉</span>
                                    <span className="break-words">{data.personal.email}</span>
                                </div>
                            )}
                            {data.personal.phone && (
                                <div className="flex items-start gap-2">
                                    <span style={{ color: theme.primary }}>☎</span>
                                    <span>{data.personal.phone}</span>
                                </div>
                            )}
                            {(data.personal.birthDate || data.personal.birthPlace) && (
                                <div className="pt-2">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "birthDate")}</span>
                                    <div>{data.personal.birthDate}</div>
                                    {data.personal.birthPlace && <div>{data.personal.birthPlace}</div>}
                                </div>
                            )}
                            {data.personal.nationality && (
                                <div className="pt-1">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "nationality")}</span>
                                    <div>{data.personal.nationality}</div>
                                </div>
                            )}
                            {data.personal.driversLicense && (
                                <div className="pt-1">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "driversLicense")}</span>
                                    <div>{data.personal.driversLicense}</div>
                                </div>
                            )}
                            {data.personal.linkedIn && (
                                <div className="pt-1">
                                    <span className="font-semibold" style={{ color: theme.text }}>LinkedIn</span>
                                    <div className="break-words"><LinkText value={data.personal.linkedIn} /></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills with level dots */}
                    {data.skills.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>◆</span>{resumeText(data, "skills")}</h2>
                            <div className="space-y-2">
                                {data.skills.map((skill, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className="text-xs" style={{ color: theme.text }}>
                                            {typeof skill === 'object' ? skill.name : skill}
                                        </span>
                                        <SkillDots
                                            level={typeof skill === 'object' ? skill.level : 3}
                                            color={theme.primary}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages with visual bars */}
                    {data.languages.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>◆</span>{resumeText(data, "languages")}</h2>
                            <div className="space-y-3">
                                {data.languages.map((lang, i) => (
                                    <div key={i}>
                                        <div className="text-xs font-medium mb-1" style={{ color: theme.text }}>
                                            {typeof lang === 'object' ? lang.name : lang}
                                        </div>
                                        {typeof lang === 'object' && lang.level && (
                                            <LanguageBar level={lang.level} color={theme.primary} />
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
                                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>◆</span>{resumeText(data, "interests")}</h2>
                            <div className="flex flex-wrap gap-1">
                                {data.interests.map((interest, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-1 rounded"
                                        style={{
                                            backgroundColor: `${theme.primary}20`,
                                            color: theme.text
                                        }}
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 space-y-5">
                    {/* Profile Summary */}
                    {data.personal.summary && (
                        <div>
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-3 pb-2"
                                style={{
                                    color: theme.primary,
                                    borderBottom: `2px solid ${theme.primary}`
                                }}
                            >{resumeText(data, "profile")}</h2>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {data.personal.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience with timeline */}
                    {data.experience.length > 0 && (
                        <div>
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-3 pb-2"
                                style={{
                                    color: theme.primary,
                                    borderBottom: `2px solid ${theme.primary}`
                                }}
                            >{resumeText(data, "experience")}</h2>
                            <div className="space-y-4">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="relative pl-4" style={{ borderLeft: `2px solid ${theme.border}` }}>
                                        <div
                                            className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                                            style={{ backgroundColor: theme.primary }}
                                        />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm">{exp.role}</h3>
                                                <p className="text-xs" style={{ color: theme.secondary }}>
                                                    {exp.company}{exp.location && `, ${exp.location}`}
                                                </p>
                                            </div>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded"
                                                style={{
                                                    backgroundColor: `${theme.primary}15`,
                                                    color: theme.primary
                                                }}
                                            >
                                                {exp.start} - {exp.end}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className="text-xs mt-2 leading-relaxed" style={{ color: theme.textMuted }}>
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
                        <div>
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-3 pb-2"
                                style={{
                                    color: theme.primary,
                                    borderBottom: `2px solid ${theme.primary}`
                                }}
                            >{resumeText(data, "internships")}</h2>
                            <div className="space-y-3">
                                {data.internships.map((intern, i) => (
                                    <div key={i} className="relative pl-4" style={{ borderLeft: `2px solid ${theme.secondary || theme.primary}` }}>
                                        <div
                                            className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                                            style={{ backgroundColor: theme.secondary || theme.primary }}
                                        />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm">{intern.role}</h3>
                                                <p className="text-xs" style={{ color: theme.secondary }}>
                                                    {intern.company}{intern.location && `, ${intern.location}`}
                                                </p>
                                            </div>
                                            <span className="text-xs" style={{ color: theme.textMuted }}>
                                                {intern.start} - {intern.end}
                                            </span>
                                        </div>
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
                        <div>
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-3 pb-2"
                                style={{
                                    color: theme.primary,
                                    borderBottom: `2px solid ${theme.primary}`
                                }}
                            >{resumeText(data, "education")}</h2>
                            <div className="space-y-3">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="relative pl-4" style={{ borderLeft: `2px solid ${theme.border}` }}>
                                        <div
                                            className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                                            style={{ backgroundColor: theme.secondary || theme.primary }}
                                        />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm">{edu.degree}</h3>
                                                <p className="text-xs" style={{ color: theme.textMuted }}>
                                                    {edu.school}{edu.location && `, ${edu.location}`}
                                                </p>
                                            </div>
                                            <span className="text-xs" style={{ color: theme.textMuted }}>
                                                {edu.start} - {edu.end}
                                            </span>
                                        </div>
                                        {edu.description && (
                                            <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                                                {edu.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Courses */}
                    {data.courses && data.courses.length > 0 && (
                        <div>
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-3 pb-2"
                                style={{
                                    color: theme.primary,
                                    borderBottom: `2px solid ${theme.primary}`
                                }}
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
                        <div>
                            <h2
                                className="text-sm font-bold uppercase tracking-wider mb-3 pb-2"
                                style={{
                                    color: theme.primary,
                                    borderBottom: `2px solid ${theme.primary}`
                                }}
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
                </div>
            </div>
        </div>
    );
}



