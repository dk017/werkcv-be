import { redirect } from "next/navigation";
import { getCVWithSettings } from "../actions";
import { getCurrentUser } from "@/lib/auth";
import Editor from "./editor";

export default async function EditorPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;
    const user = await getCurrentUser();

    if (!user) {
        const next = id ? `/editor?id=${encodeURIComponent(id)}` : "/templates";
        redirect(`/login?next=${encodeURIComponent(next)}`);
    }

    if (!id) {
        // No ID provided, redirect to template selection
        redirect(`/templates`);
    }

    const cv = await getCVWithSettings(id);

    if (!cv) {
        // CV not found, redirect to template selection
        redirect(`/templates`);
    }

    return (
        <Editor
            initialData={cv.data}
            id={id}
            initialTemplateId={cv.templateId}
            initialColorThemeId={cv.colorThemeId}
            uiLanguage="nl"
        />
    );
}
