'use client';

import { useState, useEffect } from 'react';

interface TocItem {
    id: string;
    label: string;
}

interface TableOfContentsProps {
    items: TocItem[];
    title?: string;
}

export function TableOfContents({ items, title = 'Inhoudsopgave' }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -80% 0px' }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <nav className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-lg mb-4 text-gray-900">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={item.id}>
                        <button
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full text-left flex items-start gap-3 py-1 px-2 rounded transition-colors ${
                                activeId === item.id
                                    ? 'bg-blue-50 text-blue-700 font-semibold'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </span>
                            <span className="text-sm">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

// Simpler inline version for mobile
export function TableOfContentsMobile({ items }: { items: TocItem[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="inline-flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    <span className="w-5 h-5 bg-[#4ECDC4] border border-black flex items-center justify-center text-xs font-bold">
                        {index + 1}
                    </span>
                    {item.label}
                </a>
            ))}
        </div>
    );
}
