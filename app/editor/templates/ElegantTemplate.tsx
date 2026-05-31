import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatGender, formatLanguageLevel, formatMaritalStatus, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Elegant skill bars component
function SkillBars({ level, color }: { level: number; color: string }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((bar) => (
                <div
                    key={bar}
                    className="w-3 h-1 rounded-sm"
                    style={{
                        backgroundColor: bar <= level ? color : '#e5e7eb',
                    }}
                />
            ))}
        </div>
    );
}

export default function ElegantTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto flex"
            style={{ color: theme.text }}
        >
            {/* Main Content - Left 60% */}
            <div className="w-[60%] p-10 space-y-5">
                {/* Header with decorative line */}
                <div className="text-center mb-8">
                    <NameTag className="text-3xl font-serif font-bold tracking-wide">
                        {data.personal.name || resumeText(data, "nameFallback")}
                    </NameTag>
                    {data.personal.title && (
                        <p
                            className="text-base mt-2 font-serif italic"
                            style={{ color: theme.primary }}
                        >
                            {data.personal.title}
                        </p>
                    )}
                    <div
                        className="w-16 h-0.5 mx-auto mt-4"
                        style={{ backgroundColor: theme.primary }}
                    />
                </div>

                {/* Profile Summary */}
                {data.personal.summary && (
                    <div>
                        <h2
                            className="text-sm font-serif font-bold uppercase tracking-widest mb-3"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "profile")}</h2>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-light">
                            {data.personal.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div>
                        <h2
                            className="text-sm font-serif font-bold uppercase tracking-widest mb-4"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "experience")}</h2>
                        <div className="space-y-4">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold font-serif text-sm">{exp.role}</h3>
                                        <span
                                            className="text-xs italic"
                                            style={{ color: theme.textMuted }}
                                        >
                                            {exp.start} - {exp.end}
                                        </span>
                                    </div>
                                    <p
                                        className="text-sm font-serif italic"
                                        style={{ color: theme.secondary }}
                                    >
                                        {exp.company}{exp.location && `, ${exp.location}`}
                                    </p>
                                    {exp.description && (
                                        <p className="text-xs mt-2 leading-relaxed font-light" style={{ color: theme.textMuted }}>
                                            {exp.description}
                                        </p>
                                    )}
                                    {exp.highlights && exp.highlights.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.highlights.map((highlight, hi) => (
                                                <li key={hi} className="text-xs flex gap-2 font-light">
                                                    <span style={{ color: theme.primary }}>—</span>
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
                            className="text-sm font-serif font-bold uppercase tracking-widest mb-4"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "internships")}</h2>
                        <div className="space-y-3">
                            {data.internships.map((intern, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold font-serif text-sm">{intern.role}</h3>
                                        <span
                                            className="text-xs italic"
                                            style={{ color: theme.textMuted }}
                                        >
                                            {intern.start} - {intern.end}
                                        </span>
                                    </div>
                                    <p
                                        className="text-sm font-serif italic"
                                        style={{ color: theme.secondary }}
                                    >
                                        {intern.company}{intern.location && `, ${intern.location}`}
                                    </p>
                                    {intern.description && (
                                        <p className="text-xs mt-1 leading-relaxed font-light" style={{ color: theme.textMuted }}>
                                            {intern.description}
                                        </p>
                                    )}
                                    {intern.highlights && intern.highlights.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {intern.highlights.map((highlight, hi) => (
                                                <li key={hi} className="text-xs flex gap-2 font-light">
                                                    <span style={{ color: theme.primary }}>—</span>
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
                            className="text-sm font-serif font-bold uppercase tracking-widest mb-4"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "education")}</h2>
                        <div className="space-y-3">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-sm font-serif">{edu.degree}</h3>
                                        <span
                                            className="text-xs italic"
                                            style={{ color: theme.textMuted }}
                                        >
                                            {edu.start} - {edu.end}
                                        </span>
                                    </div>
                                    <p className="text-sm font-light" style={{ color: theme.textMuted }}>
                                        {edu.school}{edu.location && `, ${edu.location}`}
                                    </p>
                                    {edu.description && (
                                        <p className="text-xs mt-1 leading-relaxed font-light" style={{ color: theme.textMuted }}>
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
                            className="text-sm font-serif font-bold uppercase tracking-widest mb-3"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "courses")}</h2>
                        <div className="space-y-1">
                            {data.courses.map((course, i) => (
                                <div key={i} className="flex justify-between text-sm font-light">
                                    <span className="font-medium">{course.name}</span>
                                    <span className="italic" style={{ color: theme.textMuted }}>
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
                            className="text-sm font-serif font-bold uppercase tracking-widest mb-3"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "awards")}</h2>
                        <ul className="space-y-1">
                            {data.awards.map((award, i) => (
                                <li key={i} className="text-sm font-light flex items-start gap-2">
                                    <span style={{ color: theme.primary }}>&mdash;</span>
                                    <span>{award}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Sidebar - Right 40% */}
            <div
                className="w-[40%] p-6 space-y-5"
                style={{
                    backgroundColor: `${theme.primary}08`,
                    borderLeft: `1px solid ${theme.border}`
                }}
            >
                {/* Photo or initials */}
                <div className="flex justify-center mb-6">
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-28 h-28 rounded-full object-cover"
                            style={{ border: `2px solid ${theme.primary}` }}
                        />
                    ) : (
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-serif"
                            style={{
                                border: `2px solid ${theme.primary}`,
                                color: theme.primary
                            }}
                        >
                            {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                        </div>
                    )}
                </div>

                {/* Personalia */}
                <div>
                    <h2
                        className="text-xs font-serif font-bold uppercase tracking-widest mb-3"
                        style={{ color: theme.primary }}
                    >{resumeText(data, "personalDetails")}</h2>
                    <div className="space-y-2 text-xs" style={{ color: theme.textMuted }}>
                        {data.personal.address && (
                            <div>
                                <div className="font-medium" style={{ color: theme.text }}>{data.personal.address}</div>
                                {data.personal.postalCode && <div>{data.personal.postalCode}</div>}
                            </div>
                        )}
                        {data.personal.email && (
                            <div className="break-words">{data.personal.email}</div>
                        )}
                        {data.personal.phone && <div>{data.personal.phone}</div>}
                        {(data.personal.birthDate || data.personal.birthPlace) && (
                            <div className="pt-2">
                                <div className="font-medium" style={{ color: theme.text }}>{resumeText(data, "birthDate")}</div>
                                <div>{data.personal.birthDate}</div>
                                {data.personal.birthPlace && <div>{data.personal.birthPlace}</div>}
                            </div>
                        )}
                        {data.personal.nationality && (
                            <div className="pt-1">
                                <div className="font-medium" style={{ color: theme.text }}>{resumeText(data, "nationality")}</div>
                                <div>{data.personal.nationality}</div>
                            </div>
                        )}
                        {data.personal.driversLicense && (
                            <div className="pt-1">
                                <div className="font-medium" style={{ color: theme.text }}>{resumeText(data, "driversLicense")}</div>
                                <div>{data.personal.driversLicense}</div>
                            </div>
                        )}
                        {formatGender(data.personal.gender, data) && (
                            <div className="pt-1">
                                <div className="font-medium" style={{ color: theme.text }}>{resumeText(data, "gender")}</div>
                                <div>{formatGender(data.personal.gender, data)}</div>
                            </div>
                        )}
                        {formatMaritalStatus(data.personal.maritalStatus, data) && (
                            <div className="pt-1">
                                <div className="font-medium" style={{ color: theme.text }}>{resumeText(data, "maritalStatus")}</div>
                                <div>{formatMaritalStatus(data.personal.maritalStatus, data)}</div>
                            </div>
                        )}
                        {data.personal.linkedIn && (
                            <div className="pt-1">
                                <div className="font-medium" style={{ color: theme.text }}>LinkedIn</div>
                                <div className="break-words"><LinkText value={data.personal.linkedIn} /></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills with bars */}
                {data.skills.length > 0 && (
                    <div>
                        <h2
                            className="text-xs font-serif font-bold uppercase tracking-widest mb-3"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "skills")}</h2>
                        <div className="space-y-2">
                            {data.skills.map((skill, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs" style={{ color: theme.text }}>
                                        {typeof skill === 'object' ? skill.name : skill}
                                    </span>
                                    <SkillBars
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
                            className="text-xs font-serif font-bold uppercase tracking-widest mb-3"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "languages")}</h2>
                        <div className="space-y-1">
                            {data.languages.map((lang, i) => (
                                <div key={i}>
                                    <div className="text-xs font-medium" style={{ color: theme.text }}>
                                        {typeof lang === 'object' ? lang.name : lang}
                                    </div>
                                    {typeof lang === 'object' && lang.level && (
                                        <div className="text-xs italic" style={{ color: theme.textMuted }}>{formatLanguageLevel(lang.level, data)}</div>
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
                            className="text-xs font-serif font-bold uppercase tracking-widest mb-3"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "interests")}</h2>
                        <div className="flex flex-wrap gap-1">
                            {data.interests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="text-xs px-2 py-1 rounded font-light"
                                    style={{
                                        border: `1px solid ${theme.border}`,
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
        </div>
    );
}



