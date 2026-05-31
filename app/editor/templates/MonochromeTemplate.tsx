import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatLanguageLevel, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

export default function MonochromeTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto p-10"
            style={{ color: theme.text }}
        >
            {/* Header with strong typography */}
            <div className="mb-6 pb-4" style={{ borderBottom: `3px solid ${theme.text}` }}>
                <div className="flex items-start justify-between">
                    <div>
                        <NameTag className="text-3xl font-black uppercase tracking-tight mb-1">
                            {data.personal.name || resumeText(data, "nameFallback")}
                        </NameTag>
                        {data.personal.title && (
                            <p className="text-base font-light tracking-wide" style={{ color: theme.textMuted }}>
                                {data.personal.title}
                            </p>
                        )}
                    </div>
                    {/* Photo or Initial */}
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-14 h-14 object-cover"
                            style={{ border: `2px solid ${theme.text}` }}
                        />
                    ) : (
                        <div
                            className="w-14 h-14 flex items-center justify-center text-2xl font-black"
                            style={{
                                border: `2px solid ${theme.text}`,
                                color: theme.text
                            }}
                        >
                            {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                        </div>
                    )}
                </div>

                {/* Contact row */}
                <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: theme.textMuted }}>
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>• {data.personal.phone}</span>}
                    {data.personal.address && <span>• {data.personal.address}</span>}
                    {data.personal.postalCode && <span>• {data.personal.postalCode}</span>}
                </div>

                {/* Personal details row */}
                <div className="flex flex-wrap gap-4 mt-2 text-xs" style={{ color: theme.textMuted }}>
                    {data.personal.birthDate && (
                        <span><strong style={{ color: theme.text }}>{resumeText(data, "birthDateAndPlace")}:</strong> {data.personal.birthDate}{data.personal.birthPlace && `, ${data.personal.birthPlace}`}</span>
                    )}
                    {data.personal.nationality && (
                        <span><strong style={{ color: theme.text }}>{resumeText(data, "nationality")}:</strong> {data.personal.nationality}</span>
                    )}
                    {data.personal.driversLicense && (
                        <span><strong style={{ color: theme.text }}>{resumeText(data, "driversLicense")}:</strong> {data.personal.driversLicense}</span>
                    )}
                    {data.personal.linkedIn && (
                        <span><strong style={{ color: theme.text }}>LinkedIn:</strong> <LinkText value={data.personal.linkedIn} /></span>
                    )}
                </div>
            </div>

            {/* Two column layout for content */}
            <div className="flex gap-8">
                {/* Main Content - Left */}
                <div className="flex-1 space-y-5">
                    {/* Profile Summary */}
                    {data.personal.summary && (
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest mb-2">{resumeText(data, "profile")}</h2>
                            <p className="text-xs leading-relaxed whitespace-pre-wrap font-light">
                                {data.personal.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience.length > 0 && (
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest mb-3">{resumeText(data, "experience")}</h2>
                            <div className="space-y-4">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-sm">{exp.role}</h3>
                                            <span className="text-xs font-medium" style={{ color: theme.textMuted }}>
                                                {exp.start} — {exp.end}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium" style={{ color: theme.textMuted }}>
                                            {exp.company}{exp.location && ` · ${exp.location}`}
                                        </p>
                                        {exp.description && (
                                            <p className="text-xs mt-1 leading-relaxed font-light" style={{ color: theme.textMuted }}>
                                                {exp.description}
                                            </p>
                                        )}
                                        {exp.highlights && exp.highlights.length > 0 && (
                                            <ul className="mt-1 space-y-0.5">
                                                {exp.highlights.map((highlight, hi) => (
                                                    <li key={hi} className="text-xs flex gap-2 font-light">
                                                        <span>—</span>
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
                            <h2 className="text-xs font-black uppercase tracking-widest mb-3">{resumeText(data, "internships")}</h2>
                            <div className="space-y-3">
                                {data.internships.map((intern, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-xs">{intern.role}</h3>
                                            <span className="text-xs" style={{ color: theme.textMuted }}>
                                                {intern.start} — {intern.end}
                                            </span>
                                        </div>
                                        <p className="text-xs font-light" style={{ color: theme.textMuted }}>
                                            {intern.company}{intern.location && ` · ${intern.location}`}
                                        </p>
                                        {intern.description && (
                                            <p className="text-xs mt-1 font-light" style={{ color: theme.textMuted }}>
                                                {intern.description}
                                            </p>
                                        )}
                                        {intern.highlights && intern.highlights.length > 0 && (
                                            <ul className="mt-1 space-y-0.5">
                                                {intern.highlights.map((highlight, hi) => (
                                                    <li key={hi} className="text-xs flex gap-2 font-light">
                                                        <span>—</span>
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
                            <h2 className="text-xs font-black uppercase tracking-widest mb-3">{resumeText(data, "education")}</h2>
                            <div className="space-y-3">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="flex justify-between items-baseline">
                                        <div>
                                            <h3 className="font-bold text-xs">{edu.degree}</h3>
                                            <p className="text-xs font-light" style={{ color: theme.textMuted }}>
                                                {edu.school}{edu.location && `, ${edu.location}`}
                                            </p>
                                            {edu.description && (
                                                <p className="text-xs mt-1 font-light" style={{ color: theme.textMuted }}>
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs" style={{ color: theme.textMuted }}>
                                            {edu.start} — {edu.end}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Courses */}
                    {data.courses && data.courses.length > 0 && (
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest mb-2">{resumeText(data, "coursesShort")}</h2>
                            <div className="space-y-1">
                                {data.courses.map((course, i) => (
                                    <div key={i} className="flex justify-between text-xs font-light">
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
                            <h2 className="text-xs font-black uppercase tracking-widest mb-2">{resumeText(data, "awardsShort")}</h2>
                            <ul className="space-y-1">
                                {data.awards.map((award, i) => (
                                    <li key={i} className="text-xs font-light flex items-start gap-2">
                                        <span>•</span>
                                        <span>{award}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Sidebar - Right */}
                <div className="w-[28%] space-y-5">
                    {/* Skills */}
                    {data.skills.length > 0 && (
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest mb-2">{resumeText(data, "skills")}</h2>
                            <div className="space-y-1">
                                {data.skills.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="text-xs py-1 px-2 flex justify-between items-center"
                                        style={{
                                            backgroundColor: i % 2 === 0 ? '#f5f5f5' : 'transparent'
                                        }}
                                    >
                                        <span>{typeof skill === 'object' ? skill.name : skill}</span>
                                        {typeof skill === 'object' && (
                                            <span className="text-[10px] opacity-50">
                                                {['●', '●●', '●●●', '●●●●', '●●●●●'][skill.level - 1] || '●●●'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {data.languages.length > 0 && (
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest mb-2">{resumeText(data, "languages")}</h2>
                            <div className="space-y-1">
                                {data.languages.map((lang, i) => (
                                    <div
                                        key={i}
                                        className="text-xs py-1 px-2"
                                        style={{
                                            backgroundColor: i % 2 === 0 ? '#f5f5f5' : 'transparent'
                                        }}
                                    >
                                        <div className="font-medium">
                                            {typeof lang === 'object' ? lang.name : lang}
                                        </div>
                                        {typeof lang === 'object' && lang.level && (
                                            <div className="text-[10px] opacity-50">{formatLanguageLevel(lang.level, data)}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interests */}
                    {data.interests && data.interests.length > 0 && (
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest mb-2">{resumeText(data, "interests")}</h2>
                            <p className="text-xs font-light leading-relaxed">
                                {data.interests.join(' · ')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}



