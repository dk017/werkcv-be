"use client";

import { useState, useRef, useCallback } from "react";
import { CVData } from "@/lib/cv";
import { UiLanguage } from "@/lib/ui-language";

interface CVUploaderProps {
  onParsed: (data: CVData) => void;
  onClose: () => void;
  uiLanguage?: UiLanguage;
}

export default function CVUploader({
  onParsed,
  onClose,
  uiLanguage = "nl",
}: CVUploaderProps) {
  const isEnglish = uiLanguage === "en";
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError(
          isEnglish
            ? "Invalid file type. Upload a PDF or Word document."
            : "Ongeldig bestandstype. Upload een PDF of Word document.",
        );
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError(
          isEnglish
            ? "File is too large. Maximum size is 10MB."
            : "Bestand is te groot. Maximale grootte is 10MB.",
        );
        return;
      }

      setError(null);
      setIsUploading(true);
      setProgress(isEnglish ? "Uploading file..." : "Bestand wordt geüpload...");

      try {
        const formData = new FormData();
        formData.append("file", file);

        setProgress(
          isEnglish ? "Analyzing CV with AI..." : "CV wordt geanalyseerd met AI...",
        );

        const response = await fetch("/api/parse-cv-only", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              (isEnglish
                ? "Something went wrong while processing the file."
                : "Er ging iets mis bij het verwerken"),
          );
        }

        setProgress(
          isEnglish ? "Filling in your data..." : "Gegevens worden ingevuld...",
        );

        await new Promise((resolve) => setTimeout(resolve, 500));

        onParsed(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : isEnglish
              ? "Something went wrong."
              : "Er ging iets mis",
        );
      } finally {
        setIsUploading(false);
        setProgress("");
      }
    },
    [isEnglish, onParsed],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-4 border-black bg-blue-400 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-black uppercase text-black">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            {isEnglish ? "Upload CV" : "CV Uploaden"}
          </h2>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex h-8 w-8 items-center justify-center border-3 border-black bg-white text-lg font-black transition-colors hover:bg-red-400 disabled:opacity-50"
            style={{ borderWidth: "3px" }}
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {isUploading ? (
            <div className="py-8 text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-black border-t-yellow-400" />
              <p className="font-bold text-black">{progress}</p>
              <p className="mt-2 text-sm text-gray-600">
                {isEnglish
                  ? "This can take a few seconds..."
                  : "Dit kan enkele seconden duren..."}
              </p>
            </div>
          ) : (
            <>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`cursor-pointer border-4 border-dashed p-8 text-center transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-black bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleInputChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                      isDragging ? "bg-blue-200" : "bg-yellow-400"
                    }`}
                  >
                    <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-black text-black">
                      {isDragging
                        ? isEnglish
                          ? "Drop to upload"
                          : "Laat los om te uploaden"
                        : isEnglish
                          ? "Drag your CV here"
                          : "Sleep je CV hier"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {isEnglish ? "or " : "of "}
                      <span className="font-bold text-blue-600 underline">
                        {isEnglish ? "click to select" : "klik om te selecteren"}
                      </span>
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {isEnglish
                      ? "PDF or Word • Max 10MB • Dutch or English"
                      : "PDF of Word • Max 10MB • Nederlands of Engels"}
                  </p>
                </div>
              </div>

              {error && (
                <div
                  className="mt-4 border-3 border-red-500 bg-red-100 p-3 text-sm font-medium text-red-700"
                  style={{ borderWidth: "3px" }}
                >
                  <span className="font-black">
                    {isEnglish ? "Error:" : "Fout:"}
                  </span>{" "}
                  {error}
                </div>
              )}

              <div
                className="mt-4 border-3 border-yellow-400 bg-yellow-50 p-4"
                style={{ borderWidth: "3px" }}
              >
                <p className="text-sm font-medium text-black">
                  {isEnglish ? (
                    <>
                      <span className="font-black">Tip:</span> Upload your existing
                      CV and we will fill in the fields automatically with AI. You can
                      adjust everything afterwards.
                    </>
                  ) : (
                    <>
                      <span className="font-black">💡 Tip:</span> Upload je bestaande
                      CV en wij vullen automatisch alle velden in met AI. Je kunt
                      daarna alles aanpassen.
                    </>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        {!isUploading && (
          <div className="flex justify-end border-t-4 border-black bg-gray-50 px-6 py-4">
            <button
              onClick={onClose}
              className="border-3 border-black bg-white px-4 py-2 text-sm font-black transition-colors hover:bg-gray-100"
              style={{ borderWidth: "3px" }}
            >
              {isEnglish ? "Cancel" : "Annuleren"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
