import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Skill progress bar
function SkillBar({ level, color }: { level: number; color: string }) {
    const percentage = (level / 5) * 100;
    return (
        <div className="w-full h-1.5 rounded bg-gray-200">
            <div
                className="h-full rounded"
                style={{ backgroundColor: color, width: `${percentage}%` }}
            />
        </div>
    );
}

// Language level bar
function LanguageBar({ level, color }: { level: string; color: string }) {
    const levelMap: Record<string, number> = {
        'Moedertaal': 100,
        'Vloeiend': 85,
        'Goed': 65,
        'Basis': 35,
    };
    const percentage = levelMap[level] || 50;
    return (
        <div className="w-full h-1.5 rounded bg-gray-200">
            <div
                className="h-full rounded"
                style={{ backgroundColor: color, width: `${percentage}%` }}
            />
        </div>
    );
}

export default function RobustTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto"
            style={{ color: theme.text }}
        >
            {/* Header */}
            <div
                className="px-8 py-6"
                style={{ backgroundColor: theme.primary }}
            >
                <div className="flex items-center gap-4">
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-16 h-16 rounded object-cover border-2 border-white/30"
                        />
                    ) : (
                        <div
                            className="w-16 h-16 rounded flex items-center justify-center text-xl font-bold"
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
                        >
                            {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                        </div>
                    )}
                    <div className="text-white flex-1">
                        <NameTag className="text-2xl font-bold uppercase tracking-wide">
                            {data.personal.name || resumeText(data, "nameFallback")}
                        </NameTag>
                        {data.personal.title && (
                            <p className="text-sm opacity-90">{data.personal.title}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex min-h-[calc(297mm-88px)]">
                {/* Left Column */}
                <div className="w-[32%] p-5 space-y-4 text-sm" style={{ backgroundColor: '#f8f9fa' }}>
                    {/* Personalia */}
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                        >{resumeText(data, "personalDetails")}</h2>
                        <div className="space-y-1" style={{ color: theme.textMuted }}>
                            {data.personal.address && (
                                <div>
                                    <div className="text-xs font-semibold" style={{ color: theme.text }}>{data.personal.address}</div>
                                    {data.personal.postalCode && <div className="text-xs">{data.personal.postalCode}</div>}
                                </div>
                            )}
                            {data.personal.email && (
                                <div className="break-words text-xs">{data.personal.email}</div>
                            )}
                            {data.personal.phone && <div className="text-xs">{data.personal.phone}</div>}
                            {(data.personal.birthDate || data.personal.birthPlace) && (
                                <div className="pt-1">
                                    <div className="text-xs font-semibold" style={{ color: theme.text }}>{resumeText(data, "birthDateAndPlace")}</div>
                                    <div className="text-xs">{data.personal.birthDate}</div>
                                    {data.personal.birthPlace && <div className="text-xs">{data.personal.birthPlace}</div>}
                                </div>
                            )}
                            {data.personal.nationality && (
                                <div className="pt-1">
                                    <div className="text-xs font-semibold" style={{ color: theme.text }}>{resumeText(data, "nationality")}</div>
                                    <div className="text-xs">{data.personal.nationality}</div>
                                </div>
                            )}
                            {data.personal.driversLicense && (
                                <div className="pt-1">
                                    <div className="text-xs font-semibold" style={{ color: theme.text }}>{resumeText(data, "driversLicense")}</div>
                                    <div className="text-xs">{data.personal.driversLicense}</div>
                                </div>
                            )}
                            {data.personal.linkedIn && (
                                <div className="pt-1">
                                    <div className="text-xs font-semibold" style={{ color: theme.text }}>LinkedIn</div>
                                    <div className="text-xs break-words"><LinkText value={data.personal.linkedIn} /></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills with progress bars */}
                    {data.skills.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                            >{resumeText(data, "skills")}</h2>
                            <div className="space-y-2">
                                {data.skills.map((skill, i) => (
                                    <div key={i}>
                                        <div className="text-xs mb-0.5">
                                            {typeof skill === 'object' ? skill.name : skill}
                                        </div>
                                        <SkillBar
                                            level={typeof skill === 'object' ? skill.level : 3}
                                            color={theme.primary}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages with bars */}
                    {data.languages.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                            >{resumeText(data, "languages")}</h2>
                            <div className="space-y-2">
                                {data.languages.map((lang, i) => (
                                    <div key={i}>
                                        <div className="text-xs font-medium mb-0.5">
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
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                            >{resumeText(data, "interests")}</h2>
                            <div className="flex flex-wrap gap-1">
                                {data.interests.map((interest, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 rounded"
                                        style={{
                                            backgroundColor: `${theme.primary}15`,
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
                <div className="flex-1 p-5 space-y-4">
                    {/* Profile Summary */}
                    {data.personal.summary && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                            >{resumeText(data, "profile")}</h2>
                            <p className="text-xs leading-relaxed whitespace-pre-wrap">
                                {data.personal.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                            >{resumeText(data, "experience")}</h2>
                            <div className="space-y-3">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-sm">{exp.role}</h3>
                                            <span className="text-xs" style={{ color: theme.textMuted }}>
                                                {exp.start} - {exp.end}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium" style={{ color: theme.secondary }}>
                                            {exp.company}{exp.location && ` | ${exp.location}`}
                                        </p>
                                        {exp.description && (
                                            <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                                                {exp.description}
                                            </p>
                                        )}
                                        {exp.highlights && exp.highlights.length > 0 && (
                                            <ul className="mt-1 space-y-0.5">
                                                {exp.highlights.map((highlight, hi) => (
                                                    <li key={hi} className="text-xs flex gap-1">
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
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                            >{resumeText(data, "internships")}</h2>
                            <div className="space-y-2">
                                {data.internships.map((intern, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-xs">{intern.role}</h3>
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
                                            <ul className="mt-1 space-y-0.5">
                                                {intern.highlights.map((highlight, hi) => (
                                                    <li key={hi} className="text-xs flex gap-1">
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
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                            >{resumeText(data, "education")}</h2>
                            <div className="space-y-2">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="flex justify-between items-baseline">
                                        <div>
                                            <h3 className="font-bold text-xs">{edu.degree}</h3>
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
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                            >{resumeText(data, "coursesShort")}</h2>
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
                                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                                style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
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



