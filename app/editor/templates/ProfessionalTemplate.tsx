import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatGender, formatLanguageLevel, formatMaritalStatus, resumeText } from "@/lib/resume-language";
interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Skill level dots component
function SkillDots({ level, color }: { level: number; color: string }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((dot) => (
                <div
                    key={dot}
                    className="w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: dot <= level ? color : '#e5e7eb',
                    }}
                />
            ))}
        </div>
    );
}

export default function ProfessionalTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto shadow-lg"
            style={{ color: theme.text }}
        >
            {/* Two Column Layout */}
            <div className="flex min-h-[297mm]">
                {/* Left Sidebar - Personal Info */}
                <div
                    className="w-[35%] p-6 space-y-5"
                    style={{ backgroundColor: theme.headerBg || `${theme.primary}10` }}
                >
                    {/* Photo or initials */}
                    <div className="flex justify-center mb-4">
                        {data.personal.photo ? (
                            <img
                                src={data.personal.photo}
                                alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                                className="w-28 h-28 rounded-full object-cover"
                                style={{ border: `4px solid ${theme.primary}` }}
                            />
                        ) : (
                            <div
                                className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                                style={{ backgroundColor: theme.primary }}
                            >
                                {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                            </div>
                        )}
                    </div>

                    {/* Personalia Section */}
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span>●</span>{resumeText(data, "personalDetails")}</h2>
                        <div className="space-y-2 text-xs" style={{ color: theme.textMuted }}>
                            {data.personal.address && (
                                <div>
                                    <div className="font-semibold" style={{ color: theme.text }}>{data.personal.address}</div>
                                </div>
                            )}
                            {data.personal.postalCode && (
                                <div>{data.personal.postalCode}</div>
                            )}
                            {data.personal.phone && <div>{data.personal.phone}</div>}
                            {data.personal.email && (
                                <div className="break-words">{data.personal.email}</div>
                            )}
                            {(data.personal.birthDate || data.personal.birthPlace) && (
                                <div className="pt-2">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "birthDateAndPlace")}</span>
                                    <div>{data.personal.birthDate}</div>
                                    {data.personal.birthPlace && <div>{data.personal.birthPlace}</div>}
                                </div>
                            )}
                            {data.personal.nationality && (
                                <div className="pt-2">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "nationality")}</span>
                                    <div>{data.personal.nationality}</div>
                                </div>
                            )}
                            {data.personal.driversLicense && (
                                <div className="pt-2">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "driversLicense")}</span>
                                    <div>{data.personal.driversLicense}</div>
                                </div>
                            )}
                            {formatGender(data.personal.gender, data) && (
                                <div className="pt-2">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "gender")}</span>
                                    <div>{formatGender(data.personal.gender, data)}</div>
                                </div>
                            )}
                            {formatMaritalStatus(data.personal.maritalStatus, data) && (
                                <div className="pt-2">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "maritalStatus")}</span>
                                    <div>{formatMaritalStatus(data.personal.maritalStatus, data)}</div>
                                </div>
                            )}
                            {data.personal.linkedIn && (
                                <div className="pt-2">
                                    <span className="font-semibold" style={{ color: theme.text }}>{resumeText(data, "links")}</span>
                                    <div className="break-words"><LinkText value={data.personal.linkedIn} /></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills with level indicators */}
                    {data.skills.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>●</span>{resumeText(data, "skills")}</h2>
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

                    {/* Languages */}
                    {data.languages.length > 0 && (
                        <div>
                            <h2
                                className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>●</span>{resumeText(data, "languages")}</h2>
                            <div className="space-y-2">
                                {data.languages.map((lang, i) => (
                                    <div key={i}>
                                        <div className="text-xs font-medium" style={{ color: theme.text }}>
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
                                className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>●</span>{resumeText(data, "interests")}</h2>
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

                {/* Right Column - Main Content */}
                <div className="flex-1 p-8 space-y-6">
                    {/* Header */}
                    <div className="pb-4 border-b-2" style={{ borderColor: theme.primary }}>
                        <NameTag className="text-3xl font-bold" style={{ color: theme.primary }}>
                            {data.personal.name || resumeText(data, "nameFallback")}
                        </NameTag>
                        {data.personal.title && (
                            <p className="text-lg mt-1" style={{ color: theme.textMuted }}>
                                {data.personal.title}
                            </p>
                        )}
                    </div>

                    {/* Summary */}
                    {data.personal.summary && (
                        <div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {data.personal.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <div>
                            <h2
                                className="text-sm font-bold uppercase tracking-widest pb-1 mb-4 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>●</span>{resumeText(data, "experience")}</h2>
                            <div className="space-y-5">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: theme.primary }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm">{exp.role}</h3>
                                                <div className="text-sm" style={{ color: theme.primary }}>
                                                    {exp.company}{exp.location && `, ${exp.location}`}
                                                </div>
                                            </div>
                                            <span className="text-xs whitespace-nowrap" style={{ color: theme.textMuted }}>
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
                                className="text-sm font-bold uppercase tracking-widest pb-1 mb-4 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>●</span>{resumeText(data, "internships")}</h2>
                            <div className="space-y-4">
                                {data.internships.map((intern, i) => (
                                    <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: theme.secondary || theme.primary }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm">{intern.role}</h3>
                                                <div className="text-sm" style={{ color: theme.primary }}>
                                                    {intern.company}{intern.location && `, ${intern.location}`}
                                                </div>
                                            </div>
                                            <span className="text-xs whitespace-nowrap" style={{ color: theme.textMuted }}>
                                                {intern.start} - {intern.end}
                                            </span>
                                        </div>
                                        {intern.description && (
                                            <p className="text-xs mt-2 leading-relaxed" style={{ color: theme.textMuted }}>
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
                                className="text-sm font-bold uppercase tracking-widest pb-1 mb-4 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>●</span>{resumeText(data, "education")}</h2>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: theme.primary }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm">{edu.degree}</h3>
                                                <div className="text-sm" style={{ color: theme.primary }}>
                                                    {edu.school}{edu.location && `, ${edu.location}`}
                                                </div>
                                            </div>
                                            <span className="text-xs whitespace-nowrap" style={{ color: theme.textMuted }}>
                                                {edu.start} - {edu.end}
                                            </span>
                                        </div>
                                        {edu.description && (
                                            <p className="text-xs mt-2 leading-relaxed" style={{ color: theme.textMuted }}>
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
                                className="text-sm font-bold uppercase tracking-widest pb-1 mb-4 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>●</span>{resumeText(data, "courses")}</h2>
                            <div className="space-y-2">
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
                                className="text-sm font-bold uppercase tracking-widest pb-1 mb-4 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span>●</span>{resumeText(data, "awards")}</h2>
                            <ul className="space-y-2 ml-1">
                                {data.awards.map((award, i) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
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




