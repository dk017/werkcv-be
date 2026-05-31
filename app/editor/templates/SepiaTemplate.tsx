import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatLanguageLevel, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Skill stars component
function SkillStars({ level }: { level: number }) {
    return (
        <div className="flex gap-0.5 text-xs">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ opacity: star <= level ? 1 : 0.3 }}>
                    ✦
                </span>
            ))}
        </div>
    );
}

export default function SepiaTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto flex"
            style={{ color: theme.text, backgroundColor: '#fefcf9' }}
        >
            {/* Left Sidebar */}
            <div
                className="w-[35%] p-6 space-y-5 min-h-[297mm]"
                style={{ backgroundColor: theme.primary }}
            >
                {/* Photo or initials */}
                <div className="flex justify-center mb-4">
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-24 h-24 rounded-full object-cover"
                            style={{ border: `3px solid rgba(255,255,255,0.3)` }}
                        />
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-serif"
                            style={{
                                backgroundColor: '#fefcf9',
                                color: theme.primary,
                                border: `3px solid rgba(255,255,255,0.3)`
                            }}
                        >
                            {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                        </div>
                    )}
                </div>

                {/* Name */}
                <div className="text-center text-white">
                    <NameTag className="text-lg font-serif font-bold">
                        {data.personal.name || resumeText(data, "nameFallback")}
                    </NameTag>
                    {data.personal.title && (
                        <p className="text-xs mt-1 opacity-80 font-serif italic">
                            {data.personal.title}
                        </p>
                    )}
                </div>

                {/* Personalia */}
                <div className="text-white">
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70 font-serif">{resumeText(data, "personalDetails")}</h2>
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
                                <div className="font-semibold opacity-70">{resumeText(data, "birthDate")}</div>
                                <div>{data.personal.birthDate}</div>
                                {data.personal.birthPlace && <div>{data.personal.birthPlace}</div>}
                            </div>
                        )}
                        {data.personal.nationality && (
                            <div className="pt-1">
                                <div className="font-semibold opacity-70">{resumeText(data, "nationality")}</div>
                                <div>{data.personal.nationality}</div>
                            </div>
                        )}
                        {data.personal.driversLicense && (
                            <div className="pt-1">
                                <div className="font-semibold opacity-70">{resumeText(data, "driversLicense")}</div>
                                <div>{data.personal.driversLicense}</div>
                            </div>
                        )}
                        {data.personal.linkedIn && (
                            <div className="pt-1">
                                <div className="font-semibold opacity-70">LinkedIn</div>
                                <div className="break-words"><LinkText value={data.personal.linkedIn} /></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills with stars */}
                {data.skills.length > 0 && (
                    <div className="text-white">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70 font-serif">{resumeText(data, "skills")}</h2>
                        <div className="space-y-2">
                            {data.skills.map((skill, i) => (
                                <div key={i} className="flex items-center justify-between opacity-90">
                                    <span className="text-xs">
                                        {typeof skill === 'object' ? skill.name : skill}
                                    </span>
                                    <SkillStars level={typeof skill === 'object' ? skill.level : 3} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                    <div className="text-white">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70 font-serif">{resumeText(data, "languages")}</h2>
                        <div className="space-y-1">
                            {data.languages.map((lang, i) => (
                                <div key={i}>
                                    <div className="text-xs font-medium opacity-90">
                                        {typeof lang === 'object' ? lang.name : lang}
                                    </div>
                                    {typeof lang === 'object' && lang.level && (
                                        <div className="text-xs opacity-60 italic">{formatLanguageLevel(lang.level, data)}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interests */}
                {data.interests && data.interests.length > 0 && (
                    <div className="text-white">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70 font-serif">{resumeText(data, "interests")}</h2>
                        <div className="flex flex-wrap gap-1">
                            {data.interests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="text-xs px-2 py-1 rounded opacity-90"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
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
                {/* Decorative header */}
                <div className="text-center mb-4">
                    <div
                        className="w-16 h-0.5 mx-auto mb-2"
                        style={{ backgroundColor: theme.primary }}
                    />
                    <span className="text-xs font-serif uppercase tracking-widest" style={{ color: theme.primary }}>
                        Curriculum Vitae
                    </span>
                    <div
                        className="w-16 h-0.5 mx-auto mt-2"
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
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold font-serif text-sm">{exp.role}</h3>
                                        <span
                                            className="text-xs font-serif italic"
                                            style={{ color: theme.textMuted }}
                                        >
                                            {exp.start} - {exp.end}
                                        </span>
                                    </div>
                                    <p
                                        className="text-xs font-serif italic"
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
                                                    <span style={{ color: theme.primary }}>✦</span>
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
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold font-serif text-sm">{intern.role}</h3>
                                        <span className="text-xs font-serif italic" style={{ color: theme.textMuted }}>
                                            {intern.start} - {intern.end}
                                        </span>
                                    </div>
                                    <p className="text-xs font-serif italic" style={{ color: theme.secondary }}>
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
                                                    <span style={{ color: theme.primary }}>✦</span>
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
                                            className="text-xs font-serif italic"
                                            style={{ color: theme.textMuted }}
                                        >
                                            {edu.start} - {edu.end}
                                        </span>
                                    </div>
                                    <p className="text-xs font-light" style={{ color: theme.textMuted }}>
                                        {edu.school}{edu.location && `, ${edu.location}`}
                                    </p>
                                    {edu.description && (
                                        <p className="text-xs mt-1 font-light" style={{ color: theme.textMuted }}>
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
                                <div key={i} className="flex justify-between text-xs font-light">
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
                                    <li key={i} className="text-xs font-light flex items-start gap-2">
                                        <span style={{ color: theme.primary }}>✦</span>
                                        <span>{award}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
            </div>
        </div>
    );
}



