import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Skill bar for remarkable template
function SkillBar({ level, color }: { level: number; color: string }) {
    const percentage = (level / 5) * 100;
    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
            <div
                className="h-full rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: color }}
            />
        </div>
    );
}

// Language bar
function LanguageBar({ level, color }: { level: string; color: string }) {
    const levelMap: Record<string, number> = {
        'Moedertaal': 100,
        'Vloeiend': 85,
        'Goed': 65,
        'Basis': 35,
    };
    const percentage = levelMap[level] || 50;
    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
            <div
                className="h-full rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: color }}
            />
        </div>
    );
}

export default function RemarkableTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto flex"
            style={{ color: theme.text }}
        >
            {/* Accent bar on left */}
            <div
                className="w-2 min-h-[297mm]"
                style={{ backgroundColor: theme.primary }}
            />

            {/* Left Sidebar */}
            <div className="w-[35%] p-6 space-y-5" style={{ backgroundColor: '#fafafa' }}>
                {/* Photo or initials */}
                <div className="flex justify-center mb-2">
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-24 h-24 rounded-full object-cover border-4"
                            style={{ borderColor: theme.primary }}
                        />
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
                            style={{
                                backgroundColor: theme.primary,
                                color: '#ffffff'
                            }}
                        >
                            {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                        </div>
                    )}
                </div>

                {/* Name */}
                <div className="text-center">
                    <NameTag className="text-lg font-bold">
                        {data.personal.name || resumeText(data, "nameFallback")}
                    </NameTag>
                    {data.personal.title && (
                        <p className="text-xs mt-1" style={{ color: theme.primary }}>
                            {data.personal.title}
                        </p>
                    )}
                </div>

                {/* Personalia */}
                <div>
                    <h2
                        className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                        style={{ color: theme.primary }}
                    >
                        <span
                            className="w-4 h-0.5"
                            style={{ backgroundColor: theme.primary }}
                        />{resumeText(data, "personalDetails")}</h2>
                    <div className="space-y-2 text-xs" style={{ color: theme.textMuted }}>
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

                {/* Skills with bars */}
                {data.skills.length > 0 && (
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span
                                className="w-4 h-0.5"
                                style={{ backgroundColor: theme.primary }}
                            />{resumeText(data, "skills")}</h2>
                        <div className="space-y-3">
                            {data.skills.map((skill, i) => (
                                <div key={i}>
                                    <span className="text-xs block mb-1">
                                        {typeof skill === 'object' ? skill.name : skill}
                                    </span>
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
                            className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span
                                className="w-4 h-0.5"
                                style={{ backgroundColor: theme.primary }}
                            />{resumeText(data, "languages")}</h2>
                        <div className="space-y-3">
                            {data.languages.map((lang, i) => (
                                <div key={i}>
                                    <div className="text-xs font-medium mb-1">
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
                            <span
                                className="w-4 h-0.5"
                                style={{ backgroundColor: theme.primary }}
                            />{resumeText(data, "interests")}</h2>
                        <div className="flex flex-wrap gap-1">
                            {data.interests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="text-xs px-2 py-1 rounded"
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
            <div className="flex-1 p-8 space-y-5">
                {/* Profile Summary */}
                {data.personal.summary && (
                    <div>
                        <p
                            className="text-sm leading-relaxed whitespace-pre-wrap italic pl-4"
                            style={{ borderLeft: `3px solid ${theme.primary}` }}
                        >
                            {data.personal.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div>
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span
                                className="w-6 h-0.5"
                                style={{ backgroundColor: theme.primary }}
                            />{resumeText(data, "experience")}</h2>
                        <div className="space-y-4">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: theme.primary }}>
                                                {exp.role}
                                            </h3>
                                            <p className="text-xs" style={{ color: theme.secondary }}>
                                                {exp.company}{exp.location && `, ${exp.location}`}
                                            </p>
                                        </div>
                                        <span
                                            className="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap"
                                            style={{
                                                backgroundColor: `${theme.primary}10`,
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
                                                    <span style={{ color: theme.primary }}>▪</span>
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
                            className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span
                                className="w-6 h-0.5"
                                style={{ backgroundColor: theme.primary }}
                            />{resumeText(data, "internships")}</h2>
                        <div className="space-y-3">
                            {data.internships.map((intern, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: theme.primary }}>
                                                {intern.role}
                                            </h3>
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
                                                    <span style={{ color: theme.primary }}>▪</span>
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
                            className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span
                                className="w-6 h-0.5"
                                style={{ backgroundColor: theme.primary }}
                            />{resumeText(data, "education")}</h2>
                        <div className="space-y-3">
                            {data.education.map((edu, i) => (
                                <div key={i} className="flex justify-between items-start">
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
                    <div>
                        <h2
                            className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                            style={{ color: theme.primary }}
                        >
                            <span
                                className="w-6 h-0.5"
                                style={{ backgroundColor: theme.primary }}
                            />{resumeText(data, "courses")}</h2>
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
                                className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                                style={{ color: theme.primary }}
                            >
                                <span
                                    className="w-6 h-0.5"
                                    style={{ backgroundColor: theme.primary }}
                                />{resumeText(data, "awards")}</h2>
                            <ul className="space-y-1">
                                {data.awards.map((award, i) => (
                                    <li key={i} className="text-xs flex items-start gap-2">
                                        <span style={{ color: theme.primary }}>▪</span>
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



