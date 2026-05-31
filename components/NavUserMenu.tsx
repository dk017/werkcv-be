'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavUserMenu() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.authenticated) setEmail(data.user.email); })
            .catch(() => {});
    }, []);

    if (!email) return null;

    const handleLogout = async () => {
        setLoggingOut(true);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/mijn-cvs"
                className="font-bold text-sm text-black hover:text-yellow-600 transition-colors"
            >
                Mijn CV&apos;s
            </Link>
            <Link
                href="/profielfoto-cv-maken"
                className="font-bold text-sm text-black hover:text-yellow-600 transition-colors"
            >
                Profielfoto&apos;s
            </Link>
            <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-xs font-bold text-gray-500 hover:text-black transition-colors disabled:opacity-50"
            >
                {loggingOut ? '...' : 'Uitloggen'}
            </button>
        </div>
    );
}
