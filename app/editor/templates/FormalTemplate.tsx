import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatGender, formatLanguageLevel, formatMaritalStatus, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Skill level dots component (white version for dark sidebar)
function SkillDots({ level }: { level: number }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((dot) => (
                <div
                    key={dot}
                    className="w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: dot <= level ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                    }}
                />
            ))}
        </div>
    );
}

export default function FormalTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto flex"
            style={{ color: theme.text }}
        >
            {/* Main Content - Left 65% */}
            <div className="w-[65%] p-10 space-y-5">
                {/* Header */}
                <div className="mb-6">
                    <NameTag
                        className="text-3xl font-bold mb-1"
                        style={{ color: theme.primary }}
                    >
                        {data.personal.name || resumeText(data, "nameFallback")}
                    </NameTag>
                    {data.personal.title && (
                        <p className="text-lg" style={{ color: theme.textMuted }}>
                            {data.personal.title}
                        </p>
                    )}
                </div>

                {/* Profile Summary */}
                {data.personal.summary && (
                    <div>
                        <h2
                            className="text-base font-bold uppercase tracking-wide mb-2 pb-1"
                            style={{ borderBottom: `2px solid ${theme.primary}` }}
                        >{resumeText(data, "profile")}</h2>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {data.personal.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div>
                        <h2
                            className="text-base font-bold uppercase tracking-wide mb-3 pb-1"
                            style={{ borderBottom: `2px solid ${theme.primary}` }}
                        >{resumeText(data, "experience")}</h2>
                        <div className="space-y-4">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold" style={{ color: theme.primary }}>
                                            {exp.role}
                                        </h3>
                                        <span className="text-xs" style={{ color: theme.textMuted }}>
                                            {exp.start} - {exp.end}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium" style={{ color: theme.secondary }}>
                                        {exp.company}{exp.location && ` • ${exp.location}`}
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
                            className="text-base font-bold uppercase tracking-wide mb-3 pb-1"
                            style={{ borderBottom: `2px solid ${theme.primary}` }}
                        >{resumeText(data, "internships")}</h2>
                        <div className="space-y-3">
                            {data.internships.map((intern, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-sm" style={{ color: theme.primary }}>
                                            {intern.role}
                                        </h3>
                                        <span className="text-xs" style={{ color: theme.textMuted }}>
                                            {intern.start} - {intern.end}
                                        </span>
                                    </div>
                                    <p className="text-sm" style={{ color: theme.secondary }}>
                                        {intern.company}{intern.location && ` • ${intern.location}`}
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

                {/* Education */}
                {data.education.length > 0 && (
                    <div>
                        <h2
                            className="text-base font-bold uppercase tracking-wide mb-3 pb-1"
                            style={{ borderBottom: `2px solid ${theme.primary}` }}
                        >{resumeText(data, "education")}</h2>
                        <div className="space-y-3">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-sm">{edu.degree}</h3>
                                        <span className="text-xs" style={{ color: theme.textMuted }}>
                                            {edu.start} - {edu.end}
                                        </span>
                                    </div>
                                    <p className="text-sm" style={{ color: theme.textMuted }}>
                                        {edu.school}{edu.location && `, ${edu.location}`}
                                    </p>
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
                            className="text-base font-bold uppercase tracking-wide mb-3 pb-1"
                            style={{ borderBottom: `2px solid ${theme.primary}` }}
                        >{resumeText(data, "courses")}</h2>
                        <div className="space-y-1">
                            {data.courses.map((course, i) => (
                                <div key={i} className="flex justify-between text-sm">
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
                            className="text-base font-bold uppercase tracking-wide mb-3 pb-1"
                            style={{ borderBottom: `2px solid ${theme.primary}` }}
                        >{resumeText(data, "awards")}</h2>
                        <ul className="space-y-1">
                            {data.awards.map((award, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                    <span style={{ color: theme.primary }}>▸</span>
                                    <span>{award}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Sidebar - Right 35% */}
            <div
                className="w-[35%] p-6 space-y-5"
                style={{ backgroundColor: theme.primary, color: '#ffffff' }}
            >
                {/* Photo or initials */}
                <div className="flex justify-center mb-4">
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-28 h-28 rounded-full object-cover border-4"
                            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                        />
                    ) : (
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold"
                            style={{ backgroundColor: theme.background, color: theme.primary }}
                        >
                            {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                        </div>
                    )}
                </div>

                {/* Personalia */}
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">{resumeText(data, "personalDetails")}</h2>
                    <div className="space-y-2 text-xs opacity-90">
                        {data.personal.address && (
                            <div>
                                <div className="font-semibold">{data.personal.address}</div>
                                {data.personal.postalCode && <div>{data.personal.postalCode}</div>}
                            </div>
                        )}
                        {data.personal.email && (
                            <div className="break-words">{data.personal.email}</div>
                        )}
                        {data.personal.phone && <div>{data.personal.phone}</div>}
                        {(data.personal.birthDate || data.personal.birthPlace) && (
                            <div className="pt-2">
                                <div className="font-semibold">{resumeText(data, "birthDate")}</div>
                                <div>{data.personal.birthDate}</div>
                                {data.personal.birthPlace && <div>{data.personal.birthPlace}</div>}
                            </div>
                        )}
                        {data.personal.nationality && (
                            <div className="pt-1">
                                <div className="font-semibold">{resumeText(data, "nationality")}</div>
                                <div>{data.personal.nationality}</div>
                            </div>
                        )}
                        {data.personal.driversLicense && (
                            <div className="pt-1">
                                <div className="font-semibold">{resumeText(data, "driversLicense")}</div>
                                <div>{data.personal.driversLicense}</div>
                            </div>
                        )}
                        {formatGender(data.personal.gender, data) && (
                            <div className="pt-1">
                                <div className="font-semibold">{resumeText(data, "gender")}</div>
                                <div>{formatGender(data.personal.gender, data)}</div>
                            </div>
                        )}
                        {formatMaritalStatus(data.personal.maritalStatus, data) && (
                            <div className="pt-1">
                                <div className="font-semibold">{resumeText(data, "maritalStatus")}</div>
                                <div>{formatMaritalStatus(data.personal.maritalStatus, data)}</div>
                            </div>
                        )}
                        {data.personal.linkedIn && (
                            <div className="pt-1">
                                <div className="font-semibold">LinkedIn</div>
                                <div className="break-words"><LinkText value={data.personal.linkedIn} /></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills with level dots */}
                {data.skills.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">{resumeText(data, "skills")}</h2>
                        <div className="space-y-2">
                            {data.skills.map((skill, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs opacity-90">
                                        {typeof skill === 'object' ? skill.name : skill}
                                    </span>
                                    <SkillDots level={typeof skill === 'object' ? skill.level : 3} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">{resumeText(data, "languages")}</h2>
                        <div className="space-y-2">
                            {data.languages.map((lang, i) => (
                                <div key={i}>
                                    <div className="text-xs font-medium opacity-90">
                                        {typeof lang === 'object' ? lang.name : lang}
                                    </div>
                                    {typeof lang === 'object' && lang.level && (
                                        <div className="text-xs opacity-70">{formatLanguageLevel(lang.level, data)}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interests */}
                {data.interests && data.interests.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">{resumeText(data, "interests")}</h2>
                        <div className="flex flex-wrap gap-1">
                            {data.interests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="text-xs px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
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



