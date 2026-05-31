import { ReactNode } from 'react';

interface ContentSectionProps {
    id: string;
    title: string;
    children: ReactNode;
    example?: ReactNode;
    className?: string;
}

export function ContentSection({ id, title, children, example, className = '' }: ContentSectionProps) {
    return (
        <section id={id} className={`scroll-mt-24 ${className}`}>
            <h2 className="text-2xl font-black mb-4 text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#4ECDC4] border-2 border-black flex items-center justify-center text-sm">
                    §
                </span>
                {title}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
                {children}
            </div>
            {example && (
                <div className="mt-6 p-5 bg-gray-50 border-l-4 border-[#4ECDC4]">
                    <p className="font-bold text-sm text-gray-500 mb-2 uppercase tracking-wide">Voorbeeld</p>
                    <div className="text-gray-700 italic">
                        {example}
                    </div>
                </div>
            )}
        </section>
    );
}

// Highlight box for tips or important info
export function HighlightBox({ title, children, variant = 'info' }: {
    title?: string;
    children: ReactNode;
    variant?: 'info' | 'tip' | 'warning';
}) {
    const variantStyles = {
        info: 'bg-blue-50 border-blue-200',
        tip: 'bg-green-50 border-green-200',
        warning: 'bg-amber-50 border-amber-200',
    };

    const iconStyles = {
        info: '💡',
        tip: '✅',
        warning: '⚠️',
    };

    return (
        <div className={`p-4 border-2 rounded-lg ${variantStyles[variant]}`}>
            {title && (
                <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span>{iconStyles[variant]}</span>
                    {title}
                </p>
            )}
            <div className="text-gray-700">{children}</div>
        </div>
    );
}

// Example text block with proper formatting
export function ExampleBlock({ label, children }: { label?: string; children: ReactNode }) {
    return (
        <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {label && (
                <span className="inline-block bg-black text-white text-xs font-bold px-2 py-0.5 mb-3">
                    {label}
                </span>
            )}
            <div className="text-gray-800">{children}</div>
        </div>
    );
}
