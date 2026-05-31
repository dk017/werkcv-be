import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({
        authenticated: true,
        user: {
            id: user.id,
            email: user.email,
        },
    });
}
