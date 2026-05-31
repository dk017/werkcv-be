'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-60"
        >
            {loading ? '...' : 'Uitloggen'}
        </button>
    );
}
