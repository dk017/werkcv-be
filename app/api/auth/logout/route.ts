import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, deleteCurrentSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await deleteCurrentSession(request);
        const response = NextResponse.json({ ok: true });
        clearSessionCookie(response);
        return response;
    } catch (error) {
        console.error('logout failed', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
