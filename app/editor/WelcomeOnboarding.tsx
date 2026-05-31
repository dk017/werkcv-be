"use client";

import { UiLanguage } from "@/lib/ui-language";

interface WelcomeOnboardingProps {
  onDismiss: () => void;
  onUploadCV: () => void;
  uiLanguage?: UiLanguage;
}

export default function WelcomeOnboarding({
  onDismiss,
  onUploadCV,
  uiLanguage = "nl",
}: WelcomeOnboardingProps) {
  const isEnglish = uiLanguage === "en";
  const steps = isEnglish
    ? [
        {
          title: "Fill in your details",
          description:
            "Start with your name, contact details, and experience. The editor saves automatically.",
          color: "bg-yellow-400",
        },
        {
          title: "Choose a template",
          description:
            "Switch template and color theme from the toolbar above and watch the live preview update.",
          color: "bg-blue-400",
        },
        {
          title: "Download your CV",
          description:
            "Ready? Download as a professional PDF. One-time €4.99, no subscription.",
          color: "bg-pink-400",
        },
      ]
    : [
        {
          title: "Vul je gegevens in",
          description:
            "Begin met je naam, contactgegevens en werkervaring. De editor slaat automatisch op.",
          color: "bg-yellow-400",
        },
        {
          title: "Kies een template",
          description:
            "Wissel van template en kleurthema in de werkbalk bovenaan. Bekijk direct het resultaat.",
          color: "bg-blue-400",
        },
        {
          title: "Download je CV",
          description:
            "Klaar? Download als professionele PDF. Eenmalig €4,99, geen abonnement.",
          color: "bg-pink-400",
        },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg border-4 border-black bg-[#FFFEF0] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-black bg-yellow-400 px-6 py-5">
          <h2 className="text-2xl font-black text-black">
            {isEnglish ? "Welcome to WerkCV.nl!" : "Welkom bij WerkCV.nl!"}
          </h2>
          <p className="mt-1 text-sm font-medium text-black/80">
            {isEnglish
              ? "Build a professional CV in 3 simple steps"
              : "Maak een professioneel CV in 3 eenvoudige stappen"}
          </p>
        </div>

        <div className="space-y-4 p-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div
                className={`h-10 w-10 ${step.color} flex-shrink-0 border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-lg font-black`}
                style={{ borderWidth: "3px" }}
              >
                {index + 1}
              </div>
              <div>
                <h3 className="text-sm font-black text-black">{step.title}</h3>
                <p className="mt-0.5 text-sm font-medium text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-6 border-t-3 border-black" style={{ borderTopWidth: "3px" }} />

        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row">
          <button
            onClick={onDismiss}
            className="flex-1 cursor-pointer border-3 border-black bg-yellow-400 py-3 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ borderWidth: "3px" }}
          >
            {isEnglish ? "Start typing" : "Begin met typen"}
          </button>
          <button
            onClick={onUploadCV}
            className="flex-1 cursor-pointer border-3 border-black bg-[#4ECDC4] py-3 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ borderWidth: "3px" }}
          >
            {isEnglish ? "Upload existing CV" : "Upload bestaand CV"}
          </button>
        </div>
      </div>
    </div>
  );
}
