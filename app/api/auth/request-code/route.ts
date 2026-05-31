import { NextRequest, NextResponse } from 'next/server';
import { requestEmailLoginCode } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = typeof body.email === 'string' ? body.email : '';
        const result = await requestEmailLoginCode(email);
        return NextResponse.json({ ok: true, ...result });
    } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_EMAIL') {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }
        console.error('request-code failed', error);
        return NextResponse.json(
            { error: 'Failed to request login code' },
            { status: 500 }
        );
    }
}
