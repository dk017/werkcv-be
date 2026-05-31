import { CVData } from "@/lib/cv";
import { ColorTheme } from "@/lib/templates";
import { LinkText } from "./link-utils";
import { formatGender, formatMaritalStatus, resumeText } from "@/lib/resume-language";

interface TemplateProps {
    data: CVData;
    theme: ColorTheme;
    nameTag?: 'h1' | 'div';
}

// Progress bar skill indicator
function SkillBar({ level, maxLevel = 5 }: { level: number; maxLevel?: number }) {
    const percentage = (level / maxLevel) * 100;
    return (
        <div className="w-full h-1.5 rounded-full bg-white/20">
            <div
                className="h-full rounded-full bg-white/70"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

// Language level bar
function LanguageBar({ level }: { level: string }) {
    const levelMap: Record<string, number> = {
        'Moedertaal': 100,
        'Vloeiend': 85,
        'Goed': 65,
        'Basis': 35,
    };
    const percentage = levelMap[level] || 50;
    return (
        <div className="w-full h-1.5 rounded-full bg-white/20">
            <div
                className="h-full rounded-full bg-white/70"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

export default function ModernTemplate({ data, theme, nameTag = 'h1' }: TemplateProps) {
    const NameTag = nameTag;
    return (
        <div
            className="bg-white min-h-[297mm] w-[210mm] mx-auto flex"
            style={{ color: theme.text }}
        >
            {/* Left Sidebar */}
            <div
                className="w-[35%] p-6 space-y-5 text-white min-h-[297mm]"
                style={{ backgroundColor: theme.primary }}
            >
                {/* Photo or initials */}
                <div className="flex justify-center mb-4">
                    {data.personal.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.name || resumeText(data, "profilePhotoAlt")}
                            className="w-28 h-28 rounded-lg object-cover border-4 border-white/20"
                        />
                    ) : (
                        <div
                            className="w-28 h-28 rounded-lg flex items-center justify-center text-3xl font-bold"
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                        >
                            {data.personal.name ? data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CV'}
                        </div>
                    )}
                </div>

                {/* Name on sidebar */}
                <div className="text-center">
                    <NameTag className="text-xl font-bold uppercase tracking-wide">
                        {data.personal.name || resumeText(data, "nameFallback")}
                    </NameTag>
                    {data.personal.title && (
                        <p className="text-xs mt-1 opacity-80">{data.personal.title}</p>
                    )}
                </div>

                {/* Personalia */}
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70">{resumeText(data, "personalDetails")}</h2>
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
                        {formatGender(data.personal.gender, data) && (
                            <div className="pt-1">
                                <div className="font-semibold opacity-70">{resumeText(data, "gender")}</div>
                                <div>{formatGender(data.personal.gender, data)}</div>
                            </div>
                        )}
                        {formatMaritalStatus(data.personal.maritalStatus, data) && (
                            <div className="pt-1">
                                <div className="font-semibold opacity-70">{resumeText(data, "maritalStatus")}</div>
                                <div>{formatMaritalStatus(data.personal.maritalStatus, data)}</div>
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

                {/* Skills with progress bars */}
                {data.skills.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70">{resumeText(data, "skills")}</h2>
                        <div className="space-y-3">
                            {data.skills.map((skill, i) => (
                                <div key={i}>
                                    <span className="text-xs">
                                        {typeof skill === 'object' ? skill.name : skill}
                                    </span>
                                    <SkillBar level={typeof skill === 'object' ? skill.level : 3} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages with visual bars */}
                {data.languages.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70">{resumeText(data, "languages")}</h2>
                        <div className="space-y-3">
                            {data.languages.map((lang, i) => (
                                <div key={i}>
                                    <div className="text-xs font-medium opacity-90 mb-1">
                                        {typeof lang === 'object' ? lang.name : lang}
                                    </div>
                                    {typeof lang === 'object' && lang.level && (
                                        <LanguageBar level={lang.level} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interests */}
                {data.interests && data.interests.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70">{resumeText(data, "interests")}</h2>
                        <div className="flex flex-wrap gap-1">
                            {data.interests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="text-xs px-2 py-1 rounded"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content - Right */}
            <div className="flex-1 p-8 space-y-5">
                {/* Profile header */}
                <div className="mb-2">
                    <h2
                        className="text-xs font-bold uppercase tracking-widest mb-1"
                        style={{ color: theme.primary }}
                    >{resumeText(data, "profile")}</h2>
                    <div
                        className="w-12 h-1 mb-3"
                        style={{ backgroundColor: theme.primary }}
                    />
                </div>

                {/* Profile Summary */}
                {data.personal.summary && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap -mt-2">
                        {data.personal.summary}
                    </p>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <div>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-1"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "experience")}</h2>
                        <div
                            className="w-12 h-1 mb-4"
                            style={{ backgroundColor: theme.primary }}
                        />
                        <div className="space-y-4">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-sm">{exp.role}</h3>
                                            <p className="text-xs" style={{ color: theme.secondary }}>
                                                {exp.company}{exp.location && ` • ${exp.location}`}
                                            </p>
                                        </div>
                                        <span
                                            className="text-xs px-2 py-0.5 rounded whitespace-nowrap"
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
                            className="text-xs font-bold uppercase tracking-widest mb-1"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "internships")}</h2>
                        <div
                            className="w-12 h-1 mb-4"
                            style={{ backgroundColor: theme.primary }}
                        />
                        <div className="space-y-3">
                            {data.internships.map((intern, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-sm">{intern.role}</h3>
                                            <p className="text-xs" style={{ color: theme.secondary }}>
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
                            className="text-xs font-bold uppercase tracking-widest mb-1"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "education")}</h2>
                        <div
                            className="w-12 h-1 mb-4"
                            style={{ backgroundColor: theme.primary }}
                        />
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
                            className="text-xs font-bold uppercase tracking-widest mb-1"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "courses")}</h2>
                        <div
                            className="w-12 h-1 mb-4"
                            style={{ backgroundColor: theme.primary }}
                        />
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
                            className="text-xs font-bold uppercase tracking-widest mb-1"
                            style={{ color: theme.primary }}
                        >{resumeText(data, "awards")}</h2>
                        <div
                            className="w-12 h-1 mb-4"
                            style={{ backgroundColor: theme.primary }}
                        />
                        <ul className="space-y-1">
                            {data.awards.map((award, i) => (
                                <li key={i} className="text-xs flex items-start gap-2">
                                    <span style={{ color: theme.primary }}>▸</span>
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



