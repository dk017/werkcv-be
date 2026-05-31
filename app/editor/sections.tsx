"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFieldArray, Control, UseFormRegister, Controller } from "react-hook-form";
import { CVData } from "@/lib/cv";
import { UiLanguage } from "@/lib/ui-language";

interface SectionProps {
    control: Control<CVData>;
    register: UseFormRegister<CVData>;
    uiLanguage?: UiLanguage;
}

// Reusable input styles - text-black ensures populated values are clearly visible (not gray like placeholders)
const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
const inputStyle = undefined;

function t(uiLanguage: UiLanguage, dutch: string, english: string) {
    return uiLanguage === "en" ? english : dutch;
}

export function ExperienceSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience",
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Werkervaring", "Experience")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ role: "", company: "", description: "", start: "", end: "", location: "", highlights: [] })}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((item, index) => (
                    <ExperienceItem
                        key={item.id}
                        index={index}
                        register={register}
                        control={control}
                        onRemove={() => remove(index)}
                        fieldName="experience"
                        uiLanguage={uiLanguage}
                    />
                ))}
                {fields.length === 0 && (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 text-slate-600 font-medium text-sm rounded-xl">
                        {t(uiLanguage, "Nog geen werkervaring toegevoegd.", "No experience added yet.")}
                    </div>
                )}
            </div>
        </section>
    );
}

function ExperienceItem({ index, register, control, onRemove, fieldName, uiLanguage }: {
    index: number;
    register: UseFormRegister<CVData>;
    control: Control<CVData>;
    onRemove: () => void;
    fieldName: "experience" | "internships";
    uiLanguage: UiLanguage;
}) {
    const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
        control,
        name: `${fieldName}.${index}.highlights` as any,
    });

    return (
        <div className="relative bg-slate-50 p-4 border border-slate-200 rounded-xl group">
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-white text-rose-700 font-semibold px-2 py-1 text-xs border border-rose-200 rounded-md opacity-0 group-hover:opacity-100 hover:bg-rose-50 transition-colors"
                title={t(uiLanguage, "Verwijderen", "Remove")}
            >
                ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Functie", "Role")}</label>
                    <input
                        {...register(`${fieldName}.${index}.role` as any)}
                        placeholder={t(uiLanguage, "bv. Software Developer", "e.g. Software Developer")}
                        className={inputClass}
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Bedrijf", "Company")}</label>
                    <input
                        {...register(`${fieldName}.${index}.company` as any)}
                        placeholder={t(uiLanguage, "bv. Tech Solutions BV", "e.g. Tech Solutions BV")}
                        className={inputClass}
                        style={inputStyle}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Start", "Start")}</label>
                    <input
                        {...register(`${fieldName}.${index}.start` as any)}
                        placeholder={t(uiLanguage, "bv. jan 2020", "e.g. Jan 2020")}
                        className={inputClass}
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Eind", "End")}</label>
                    <input
                        {...register(`${fieldName}.${index}.end` as any)}
                        placeholder={t(uiLanguage, "bv. heden", "e.g. Present")}
                        className={inputClass}
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Locatie", "Location")}</label>
                    <input
                        {...register(`${fieldName}.${index}.location` as any)}
                        placeholder={t(uiLanguage, "bv. Amsterdam", "e.g. Amsterdam")}
                        className={inputClass}
                        style={inputStyle}
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Omschrijving (optioneel)", "Description (optional)")}</label>
                <textarea
                    {...register(`${fieldName}.${index}.description` as any)}
                    placeholder={t(uiLanguage, "Korte omschrijving van je rol...", "Short description of your role...")}
                    className={`${inputClass} min-h-[60px]`}
                    style={inputStyle}
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{t(uiLanguage, "Taken & Resultaten", "Tasks & Results")}</label>
                    <button
                        type="button"
                        onClick={() => appendHighlight("" as any)}
                        className="text-xs bg-sky-100 text-sky-900 font-semibold px-2 py-1 rounded-md border border-sky-300 hover:bg-sky-200 transition-colors"
                    >
                        {t(uiLanguage, "+ Punt", "+ Bullet")}
                    </button>
                </div>
                <div className="space-y-2">
                    {highlightFields.map((h, hIndex) => (
                        <div key={h.id} className="flex gap-2 items-start">
                            <span className="text-black mt-2">•</span>
                            <textarea
                                {...register(`${fieldName}.${index}.highlights.${hIndex}` as any)}
                                placeholder={t(uiLanguage, "Beschrijf een taak of resultaat...", "Describe a task or result...")}
                                className={`${inputClass} min-h-[50px] flex-1`}
                                style={inputStyle}
                            />
                            <button
                                type="button"
                                onClick={() => removeHighlight(hIndex)}
                                className="bg-white text-rose-700 font-semibold px-2 py-1 text-xs border border-rose-200 rounded-md hover:bg-rose-50 transition-colors mt-1"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function InternshipsSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "internships",
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Stages", "Internships")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ role: "", company: "", description: "", start: "", end: "", location: "", highlights: [] })}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((item, index) => (
                    <ExperienceItem
                        key={item.id}
                        index={index}
                        register={register}
                        control={control}
                        onRemove={() => remove(index)}
                        fieldName="internships"
                        uiLanguage={uiLanguage}
                    />
                ))}
                {fields.length === 0 && (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-300 text-slate-600 font-medium text-sm rounded-xl">
                        {t(uiLanguage, "Nog geen stages toegevoegd.", "No internships added yet.")}
                    </div>
                )}
            </div>
        </section>
    );
}

export function EducationSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education",
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Opleidingen", "Education")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ degree: "", school: "", start: "", end: "", location: "", description: "" })}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((item, index) => (
                    <div key={item.id} className="relative bg-slate-50 p-4 border border-slate-200 rounded-xl group">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-2 right-2 bg-white text-rose-700 font-semibold px-2 py-1 text-xs border border-rose-200 rounded-md opacity-0 group-hover:opacity-100 hover:bg-rose-50 transition-colors"
                            title={t(uiLanguage, "Verwijderen", "Remove")}
                        >
                            ✕
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Opleiding / Studie", "Degree / Study")}</label>
                                <input
                                    {...register(`education.${index}.degree`)}
                                    placeholder={t(uiLanguage, "bv. HBO Informatica", "e.g. BSc Computer Science")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Onderwijsinstelling", "Institution")}</label>
                                <input
                                    {...register(`education.${index}.school`)}
                                    placeholder={t(uiLanguage, "bv. Hogeschool Utrecht", "e.g. Utrecht University")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Start", "Start")}</label>
                                <input
                                    {...register(`education.${index}.start`)}
                                    placeholder={t(uiLanguage, "sep 2016", "Sep 2016")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Eind", "End")}</label>
                                <input
                                    {...register(`education.${index}.end`)}
                                    placeholder={t(uiLanguage, "jun 2020", "Jun 2020")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Locatie", "Location")}</label>
                                <input
                                    {...register(`education.${index}.location`)}
                                    placeholder={t(uiLanguage, "bv. Utrecht", "e.g. Utrecht")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Omschrijving (optioneel)", "Description (optional)")}</label>
                            <textarea
                                {...register(`education.${index}.description`)}
                                placeholder={t(uiLanguage, "Relevante vakken, thesis, etc...", "Relevant coursework, thesis, etc.")}
                                className={`${inputClass} min-h-[60px]`}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                ))}
                {fields.length === 0 && (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-300 text-slate-600 font-medium text-sm rounded-xl">
                        {t(uiLanguage, "Nog geen opleiding toegevoegd.", "No education added yet.")}
                    </div>
                )}
            </div>
        </section>
    );
}

// Individual skill item with controlled level using Controller for reliable updates
function SkillItem({ index, control, register, onRemove, uiLanguage }: {
    index: number;
    control: Control<CVData>;
    register: UseFormRegister<CVData>;
    onRemove: () => void;
    uiLanguage: UiLanguage;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center bg-slate-50 p-3 border border-slate-200 rounded-xl">
            <input
                {...register(`skills.${index}.name`)}
                placeholder={t(uiLanguage, "bv. Projectmanagement", "e.g. Project Management")}
                className={`${inputClass} flex-1`}
                style={inputStyle}
            />
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-black whitespace-nowrap">{t(uiLanguage, "Niveau:", "Level:")}</span>
                <Controller
                    control={control}
                    name={`skills.${index}.level`}
                    render={({ field }) => (
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => field.onChange(level)}
                                    className={`w-5 h-5 border border-slate-300 rounded-full transition-all hover:scale-110 ${
                                        (field.value || 3) >= level ? "bg-pink-500" : "bg-white"
                                    }`}
                                    title={t(uiLanguage, `Niveau ${level}`, `Level ${level}`)}
                                />
                            ))}
                        </div>
                    )}
                />
                <button
                    type="button"
                    onClick={onRemove}
                    className="bg-white text-rose-700 font-semibold px-2 py-2 text-xs border border-rose-200 rounded-md hover:bg-rose-50 transition-colors ml-1"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export function SkillsSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills",
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Vaardigheden", "Skills")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ name: "", level: 3 })}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>
            <div className="space-y-3">
                {fields.map((item, index) => (
                    <SkillItem
                        key={item.id}
                        index={index}
                        control={control}
                        register={register}
                        onRemove={() => remove(index)}
                        uiLanguage={uiLanguage}
                    />
                ))}
            </div>
            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Voeg vaardigheden toe met een niveau (1-5 bolletjes).", "Add skills with a level (1-5 dots).")}
                </p>
            )}
        </section>
    );
}

export function LanguagesSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "languages",
    });

    const levels = [
        { value: "Moedertaal", label: uiLanguage === "en" ? "Native" : "Moedertaal / Native" },
        { value: "Vloeiend", label: uiLanguage === "en" ? "Fluent" : "Vloeiend / Fluent" },
        { value: "Goed", label: uiLanguage === "en" ? "Good" : "Goed / Good" },
        { value: "Basis", label: uiLanguage === "en" ? "Basic" : "Basis / Basic" },
    ];

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Talen", "Languages")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ name: "", level: "Goed" })}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>
            <div className="space-y-3">
                {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-center bg-slate-50 p-3 border border-slate-200 rounded-xl">
                        <input
                            {...register(`languages.${index}.name`)}
                            placeholder={t(uiLanguage, "bv. Engels", "e.g. English")}
                            className={`${inputClass} flex-1`}
                            style={inputStyle}
                        />
                        <select
                            {...register(`languages.${index}.level`)}
                            className={`${inputClass} w-40`}
                            style={inputStyle}
                        >
                            {levels.map((level) => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-red-400 text-black font-black px-2 py-2 text-xs border border-slate-300 hover:bg-red-500 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Voeg talen toe met niveau (Moedertaal, Vloeiend, Goed, Basis).", "Add languages with a level (Native, Fluent, Good, Basic).")}
                </p>
            )}
        </section>
    )
}

export function InterestsSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "interests" as any,
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Interesses", "Interests")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append("" as any)}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-1 items-center bg-lime-200 px-3 py-2 border border-slate-300">
                        <input
                            {...register(`interests.${index}` as any)}
                            placeholder={t(uiLanguage, "bv. Lezen", "e.g. Reading")}
                            className="bg-transparent border-none outline-none text-sm font-medium w-24"
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-black font-black text-xs hover:text-red-600 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Voeg interesses toe zoals \"Lezen\", \"Reizen\", \"Sport\".", "Add interests such as \"Reading\", \"Travel\", or \"Sports\".")}
                </p>
            )}
        </section>
    )
}

export function CoursesSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "courses",
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Cursussen & Certificaten", "Courses & Certifications")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ name: "", institution: "", year: "" })}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    + Toevoegen
                </button>
            </div>
            <div className="space-y-3">
                {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-center bg-slate-50 p-3 border border-slate-200 rounded-xl">
                        <input
                            {...register(`courses.${index}.name`)}
                            placeholder={t(uiLanguage, "Naam van cursus", "Course name")}
                            className={`${inputClass} flex-1`}
                            style={inputStyle}
                        />
                        <input
                            {...register(`courses.${index}.institution`)}
                            placeholder={t(uiLanguage, "Instituut", "Institution")}
                            className={`${inputClass} w-32`}
                            style={inputStyle}
                        />
                        <input
                            {...register(`courses.${index}.year`)}
                            placeholder={t(uiLanguage, "Jaar", "Year")}
                            className={`${inputClass} w-20`}
                            style={inputStyle}
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-red-400 text-black font-black px-2 py-2 text-xs border border-slate-300 hover:bg-red-500 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Voeg cursussen of certificaten toe.", "Add courses or certifications.")}
                </p>
            )}
        </section>
    )
}

export function AwardsSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "awards" as any,
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Prijzen & Onderscheidingen", "Awards & Achievements")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append("" as any)}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    + Toevoegen
                </button>
            </div>
            <div className="space-y-2">
                {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-2 items-start bg-slate-50 p-3 border border-slate-200 rounded-xl">
                        <span className="text-black mt-2">🏆</span>
                        <textarea
                            {...register(`awards.${index}` as any)}
                            placeholder={t(uiLanguage, "Beschrijf een prijs, certificaat of bijzondere prestatie...", "Describe an award, certificate, or notable achievement...")}
                            className={`${inputClass} min-h-[50px] flex-1`}
                            style={inputStyle}
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-white text-rose-700 font-semibold px-2 py-1 text-xs border border-rose-200 rounded-md hover:bg-rose-50 transition-colors mt-1"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Voeg prijzen, certificaten of bijzondere prestaties toe.", "Add awards, certifications, or notable achievements.")}
                </p>
            )}
        </section>
    )
}

export function PropertiesSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "properties" as any,
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Eigenschappen", "Strengths")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append("" as any)}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-1 items-center bg-sky-100 px-3 py-2 border border-slate-300">
                        <input
                            {...register(`properties.${index}` as any)}
                            placeholder={t(uiLanguage, "bv. Proactief", "e.g. Proactive")}
                            className="bg-transparent border-none outline-none text-sm font-medium w-28"
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-black font-black text-xs hover:text-red-600 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Voeg persoonlijke eigenschappen toe zoals \"Nauwkeurig\" of \"Leergierig\".", "Add personal strengths such as \"Accurate\" or \"Eager to learn\".")}
                </p>
            )}
        </section>
    )
}

export function ReferencesSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "references" as any,
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Referenties", "References")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ name: "", role: "", company: "", email: "", phone: "" } as any)}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((item, index) => (
                    <div key={item.id} className="relative bg-slate-50 p-4 border border-slate-200 rounded-xl group">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-2 right-2 bg-white text-rose-700 font-semibold px-2 py-1 text-xs border border-rose-200 rounded-md opacity-0 group-hover:opacity-100 hover:bg-rose-50 transition-colors"
                            title={t(uiLanguage, "Verwijderen", "Remove")}
                        >
                            ✕
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Naam", "Name")}</label>
                                <input
                                    {...register(`references.${index}.name` as any)}
                                    placeholder={t(uiLanguage, "bv. Jan Jansen", "e.g. Jane Smith")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Functie", "Role")}</label>
                                <input
                                    {...register(`references.${index}.role` as any)}
                                    placeholder={t(uiLanguage, "bv. Teamlead Engineering", "e.g. Engineering Manager")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Bedrijf", "Company")}</label>
                                <input
                                    {...register(`references.${index}.company` as any)}
                                    placeholder={t(uiLanguage, "bv. Tech BV", "e.g. Tech BV")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                                <input
                                    {...register(`references.${index}.email` as any)}
                                    placeholder="jan@bedrijf.nl"
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Telefoon", "Phone")}</label>
                                <input
                                    {...register(`references.${index}.phone` as any)}
                                    placeholder={t(uiLanguage, "06 12345678", "+31 6 12345678")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Voeg referenties toe die werkgevers mogen benaderen.", "Add references employers may contact.")}
                </p>
            )}
        </section>
    );
}

export function SideActivitiesSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "sideActivities" as any,
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Nevenactiviteiten", "Side Activities")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ title: "", organization: "", start: "", end: "", description: "" } as any)}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Toevoegen", "+ Add")}
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((item, index) => (
                    <div key={item.id} className="relative bg-slate-50 p-4 border border-slate-200 rounded-xl group">
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-2 right-2 bg-white text-rose-700 font-semibold px-2 py-1 text-xs border border-rose-200 rounded-md opacity-0 group-hover:opacity-100 hover:bg-rose-50 transition-colors"
                            title={t(uiLanguage, "Verwijderen", "Remove")}
                        >
                            ✕
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Rol of activiteit", "Role or activity")}</label>
                                <input
                                    {...register(`sideActivities.${index}.title` as any)}
                                    placeholder={t(uiLanguage, "bv. Vrijwilliger evenementen", "e.g. Volunteer events coordinator")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Organisatie", "Organization")}</label>
                                <input
                                    {...register(`sideActivities.${index}.organization` as any)}
                                    placeholder={t(uiLanguage, "bv. Stichting X", "e.g. Foundation X")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Start", "Start")}</label>
                                <input
                                    {...register(`sideActivities.${index}.start` as any)}
                                    placeholder={t(uiLanguage, "jan 2022", "Jan 2022")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Eind", "End")}</label>
                                <input
                                    {...register(`sideActivities.${index}.end` as any)}
                                    placeholder={t(uiLanguage, "heden", "Present")}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Omschrijving", "Description")}</label>
                            <textarea
                                {...register(`sideActivities.${index}.description` as any)}
                                placeholder={t(uiLanguage, "Beschrijf je bijdrage of resultaten...", "Describe your contribution or results...")}
                                className={`${inputClass} min-h-[60px]`}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Voeg nevenactiviteiten toe zoals vrijwilligerswerk, bestuur of verenigingen.", "Add side activities such as volunteering, board roles, or associations.")}
                </p>
            )}
        </section>
    );
}

function CustomSectionItem({ sectionIndex, control, register, onRemoveSection, uiLanguage }: {
    sectionIndex: number;
    control: Control<CVData>;
    register: UseFormRegister<CVData>;
    onRemoveSection: () => void;
    uiLanguage: UiLanguage;
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `customSections.${sectionIndex}.items` as any,
    });

    return (
        <div className="relative bg-slate-50 p-4 border border-slate-200 rounded-xl group">
            <button
                type="button"
                onClick={onRemoveSection}
                className="absolute top-2 right-2 bg-white text-rose-700 font-semibold px-2 py-1 text-xs border border-rose-200 rounded-md opacity-0 group-hover:opacity-100 hover:bg-rose-50 transition-colors"
                title={t(uiLanguage, "Verwijderen", "Remove")}
            >
                ✕
            </button>

            <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t(uiLanguage, "Titel onderdeel", "Section title")}</label>
                <input
                    {...register(`customSections.${sectionIndex}.title` as any)}
                    placeholder={t(uiLanguage, "bv. Publicaties", "e.g. Publications")}
                    className={inputClass}
                    style={inputStyle}
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{t(uiLanguage, "Inhoud", "Content")}</label>
                    <button
                        type="button"
                        onClick={() => append("" as any)}
                        className="text-xs bg-sky-100 text-sky-900 font-semibold px-2 py-1 rounded-md border border-sky-300 hover:bg-sky-200 transition-colors"
                    >
                        {t(uiLanguage, "+ Punt", "+ Bullet")}
                    </button>
                </div>
                <div className="space-y-2">
                    {fields.map((item, itemIndex) => (
                        <div key={item.id} className="flex gap-2 items-start">
                            <span className="text-black mt-2">•</span>
                            <textarea
                                {...register(`customSections.${sectionIndex}.items.${itemIndex}` as any)}
                                placeholder={t(uiLanguage, "Voeg detail toe...", "Add detail...")}
                                className={`${inputClass} min-h-[50px] flex-1`}
                                style={inputStyle}
                            />
                            <button
                                type="button"
                                onClick={() => remove(itemIndex)}
                                className="bg-white text-rose-700 font-semibold px-2 py-1 text-xs border border-rose-200 rounded-md hover:bg-rose-50 transition-colors mt-1"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CustomSectionsSection({ control, register, uiLanguage = "nl" }: SectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "customSections" as any,
    });

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md inline-block">
                        {t(uiLanguage, "Eigen onderdeel", "Custom Section")}
                    </span>
                </h2>
                <button
                    type="button"
                    onClick={() => append({ title: "", items: [] } as any)}
                    className="text-sm bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-md border border-emerald-700 hover:bg-emerald-700 transition-colors"
                >
                    {t(uiLanguage, "+ Onderdeel", "+ Section")}
                </button>
            </div>

            <div className="space-y-4">
                {fields.map((item, index) => (
                    <CustomSectionItem
                        key={item.id}
                        sectionIndex={index}
                        control={control}
                        register={register}
                        onRemoveSection={() => remove(index)}
                        uiLanguage={uiLanguage}
                    />
                ))}
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-slate-600 font-medium bg-slate-50 p-3 border border-dashed border-slate-300 rounded-xl">
                    {t(uiLanguage, "Maak een vrij onderdeel zoals Publicaties, Projecten of Lidmaatschappen.", "Create a free section such as Publications, Projects, or Memberships.")}
                </p>
            )}
        </section>
    );
}



