import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatLanguageLevel, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Skill progress bar for JobBoss
function SkillProgress({ level, color }: { level: number; color: string }) {
    const percentage = (level / 5) * 100;
    return (
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
            <div
                className="h-full rounded-full"
                style={{ backgroundColor: color, width: `${percentage}%` }}
            />
        </div>
    );
}

export default function JobBossTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto"
            style={{ color: theme.text }}
        >
            {/* Header with colorful banner */}
            <div
                className="px-8 py-6 flex items-center gap-5"
                style={{ backgroundColor: theme.primary }}
            >
                {/* Photo or initials */}
                {data.personal.photo ? (
                    <img
                        src={data.personal.photo}
                        alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                        className="w-20 h-20 rounded-xl object-cover border-2"
                        style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                    />
                ) : (
                    <div
                        className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold"
                        style={{ backgroundColor: '#ffffff', color: theme.primary }}
                    >
                        {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                    </div>
                )}
                <div className="text-white flex-1">
                    <NameTag className="text-2xl font-bold">
                        {data.personal.name || resumeText(data, "nameFallback")}
                    </NameTag>
                    {data.personal.title && (
                        <p className="text-sm mt-1 opacity-90">{data.personal.title}</p>
                    )}
                </div>
            </div>

            <div className="flex min-h-[calc(297mm-100px)]">
                {/* Sidebar */}
                <div className="w-[36%] p-6 space-y-5" style={{ backgroundColor: '#f5f7fa' }}>
                    {/* Personalia */}
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                                style={{ backgroundColor: theme.primary }}
                            >
                                ✉
                            </span>{resumeText(data, "personalDetails")}</h2>
                        <div className="space-y-2 text-xs pl-7" style={{ color: theme.textMuted }}>
                            {data.personal.address && (
                                <div>
                                    <div className="font-semibold" style={{ color: theme.text }}>{data.personal.address}</div>
                                    {data.personal.postalCode && <div>{data.personal.postalCode}</div>}
                                </div>
                            )}
                            {data.personal.email && (
                                <div className="break-words">{data.personal.email}</div>
                            )}
                            {data.personal.phone && <div>{data.personal.phone}</div>}
                            {(data.personal.birthDate || data.personal.birthPlace) && (
                                <div className="pt-2">
                                    <div className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "birthDate")}</div>
                                    <div>{data.personal.birthDate}</div>
                                    {data.personal.birthPlace && <div>{data.personal.birthPlace}</div>}
                                </div>
                            )}
                            {data.personal.nationality && (
                                <div className="pt-1">
                                    <div className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "nationality")}</div>
                                    <div>{data.personal.nationality}</div>
                                </div>
                            )}
                            {data.personal.driversLicense && (
                                <div className="pt-1">
                                    <div className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "driversLicense")}</div>
                                    <div>{data.personal.driversLicense}</div>
                                </div>
                            )}
                            {data.personal.linkedIn && (
                                <div className="pt-1">
                                    <div className="font-semibold" style={{ color: theme.text }}>LinkedIn</div>
                                    <div className="break-words"><LinkText value={data.personal.linkedIn} /></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills with progress bars */}
                    {data.skills.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    ★
                                </span>{resumeText(data, "skills")}</h2>
                            <div className="space-y-3 pl-7">
                                {data.skills.map((skill, i) => (
                                    <div key={i}>
                                        <div className="text-xs mb-1">
                                            {typeof skill === 'object' ? skill.name : skill}
                                        </div>
                                        <SkillProgress
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
                                className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                                    style={{ backgroundColor: theme.secondary || theme.primary }}
                                >
                                    🌐
                                </span>{resumeText(data, "languages")}</h2>
                            <div className="space-y-1 pl-7">
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
                                className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                                    style={{ backgroundColor: theme.secondary || theme.primary }}
                                >
                                    ♥
                                </span>{resumeText(data, "interests")}</h2>
                            <div className="flex flex-wrap gap-1 pl-7">
                                {data.interests.map((interest, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-1 rounded-full"
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
                <div className="flex-1 p-6 space-y-5">
                    {/* Profile */}
                    {data.personal.summary && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wide mb-3"
                                style={{ color: theme.primary }}
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
                                className="text-xs font-bold uppercase tracking-wide mb-4"
                                style={{ color: theme.primary }}
                            >{resumeText(data, "experience")}</h2>
                            <div className="space-y-4">
                                {data.experience.map((exp, i) => (
                                    <div
                                        key={i}
                                        className="relative pl-4"
                                        style={{ borderLeft: `3px solid ${theme.primary}` }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm">{exp.role}</h3>
                                                <p className="text-xs" style={{ color: theme.secondary }}>
                                                    {exp.company}{exp.location && ` • ${exp.location}`}
                                                </p>
                                            </div>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
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
                                                        <span style={{ color: theme.primary }}>▸</span>
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
                                className="text-xs font-bold uppercase tracking-wide mb-4"
                                style={{ color: theme.primary }}
                            >{resumeText(data, "internships")}</h2>
                            <div className="space-y-3">
                                {data.internships.map((intern, i) => (
                                    <div
                                        key={i}
                                        className="relative pl-4"
                                        style={{ borderLeft: `3px solid ${theme.secondary || theme.primary}` }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-xs">{intern.role}</h3>
                                                <p className="text-xs" style={{ color: theme.textMuted }}>
                                                    {intern.company}{intern.location && ` • ${intern.location}`}
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
                                className="text-xs font-bold uppercase tracking-wide mb-4"
                                style={{ color: theme.primary }}
                            >{resumeText(data, "education")}</h2>
                            <div className="space-y-3">
                                {data.education.map((edu, i) => (
                                    <div
                                        key={i}
                                        className="relative pl-4"
                                        style={{ borderLeft: `3px solid ${theme.secondary || theme.primary}` }}
                                    >
                                        <div className="flex justify-between items-start">
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Courses */}
                    {data.courses && data.courses.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-wide mb-3"
                                style={{ color: theme.primary }}
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
                                className="text-xs font-bold uppercase tracking-wide mb-3"
                                style={{ color: theme.primary }}
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



