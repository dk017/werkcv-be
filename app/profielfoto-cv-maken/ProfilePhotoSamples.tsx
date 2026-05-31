"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type ProfilePhotoSample = {
  src: string;
  alt: string;
  role: string;
  style: string;
  note: string;
};

type ProfilePhotoSamplesProps = {
  samples: ProfilePhotoSample[];
  mode: "hero" | "gallery";
};

export default function ProfilePhotoSamples({ samples, mode }: ProfilePhotoSamplesProps) {
  const [activeSample, setActiveSample] = useState<ProfilePhotoSample | null>(null);

  useEffect(() => {
    if (!activeSample) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveSample(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeSample]);

  if (mode === "hero") {
    const sample = samples[0];

    return (
      <>
        <button
          type="button"
          onClick={() => setActiveSample(sample)}
          className="group block w-full border-4 border-black bg-white p-4 text-left shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Voorbeeldoutput
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Realistisch genoeg voor cv en LinkedIn
              </h2>
            </div>
            <span className="w-fit rounded-full border-2 border-black bg-[#E9FFFC] px-3 py-1 text-xs font-black text-black">
              Klik om te bekijken
            </span>
          </div>
          <div className="relative mt-5 aspect-square overflow-hidden rounded-3xl border-2 border-black bg-[#FFFEF9]">
            <Image
              src={sample.src}
              alt={sample.alt}
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-slate-950">{sample.role}</p>
              <p className="text-xs font-bold text-slate-500">{sample.style}</p>
            </div>
            <p className="max-w-[15rem] text-right text-xs font-bold leading-relaxed text-slate-600">
              AI-demo, geen klantfoto. Jouw output wordt gemaakt van je eigen upload.
            </p>
          </div>
        </button>
        <SampleModal sample={activeSample} onClose={() => setActiveSample(null)} />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {samples.map((sample) => (
          <button
            key={sample.src}
            type="button"
            onClick={() => setActiveSample(sample)}
            className="group overflow-hidden rounded-3xl border-2 border-black bg-white text-left transition-transform hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="relative aspect-square bg-[#FFFEF9]">
              <Image
                src={sample.src}
                alt={sample.alt}
                fill
                sizes="(min-width: 1024px) 330px, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </div>
            <div className="border-t-2 border-black bg-white p-3">
              <p className="text-sm font-black text-slate-950">{sample.role}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{sample.style}</p>
              <p className="mt-2 hidden text-xs font-medium leading-relaxed text-slate-600 sm:block">
                {sample.note}
              </p>
            </div>
          </button>
        ))}
      </div>
      <SampleModal sample={activeSample} onClose={() => setActiveSample(null)} />
    </>
  );
}

function SampleModal({
  sample,
  onClose,
}: {
  sample: ProfilePhotoSample | null;
  onClose: () => void;
}) {
  if (!sample) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${sample.role} voorbeeldprofielfoto`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl border-4 border-black bg-white p-4 shadow-[10px_10px_0px_0px_rgba(78,205,196,1)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 h-10 w-10 rounded-full border-2 border-black bg-white text-xl font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Sluit voorbeeld"
        >
          ×
        </button>
        <div className="grid gap-4 md:grid-cols-[1fr_0.72fr] md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-3xl border-2 border-black bg-[#FFFEF9]">
            <Image
              src={sample.src}
              alt={sample.alt}
              fill
              sizes="(min-width: 768px) 520px, 92vw"
              className="object-cover"
            />
          </div>
          <div className="p-2">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              AI-demo voorbeeld
            </p>
            <h3 className="mt-2 text-3xl font-black leading-tight text-slate-950">{sample.role}</h3>
            <p className="mt-2 text-sm font-black text-[#00877D]">{sample.style}</p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">{sample.note}</p>
            <p className="mt-4 rounded-2xl border-2 border-black bg-[#E9FFFC] p-3 text-xs font-bold leading-relaxed text-slate-800">
              Dit is geen klantfoto. Het laat zien welke richting WerkCV zoekt: natuurlijk,
              scherp en veilig voor een Belgische sollicitatie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
