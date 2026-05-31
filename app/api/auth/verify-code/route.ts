import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { applySessionCookie, verifyEmailLoginCode } from '@/lib/auth';
import { sanitizeAttribution } from '@/lib/attribution';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = typeof body.email === 'string' ? body.email : '';
        const code = typeof body.code === 'string' ? body.code : '';
        const nextPath = typeof body.next === 'string' && body.next.startsWith('/') ? body.next : null;
        const attribution = sanitizeAttribution(body.attribution);

        const session = await verifyEmailLoginCode(email, code, attribution);
        if (!session) {
            return NextResponse.json(
                { error: 'Invalid or expired code' },
                { status: 401 }
            );
        }

        if (session.isNewUser) {
            try {
                await prisma.analyticsEvent.create({
                    data: {
                        event: 'signup_completed',
                        path: attribution?.firstTouchPath || nextPath || null,
                        cluster: attribution?.firstTouchCluster || null,
                        properties: {
                            userId: session.userId,
                            method: 'email_code',
                            nextPath,
                            sourcePath: attribution?.firstTouchPath || null,
                            sourceCluster: attribution?.firstTouchCluster || null,
                            sourceLocale: attribution?.locale || null,
                        } as Prisma.InputJsonValue,
                        attribution: (attribution || undefined) as Prisma.InputJsonValue | undefined,
                    },
                });
            } catch (error) {
                console.error('signup_completed_event_persist_failed', error);
            }
        }

        const response = NextResponse.json({ ok: true, userId: session.userId, isNewUser: session.isNewUser });
        applySessionCookie(response, session.token);
        return response;
    } catch (error) {
        console.error('verify-code failed', error);
        return NextResponse.json(
            { error: 'Failed to verify login code' },
            { status: 500 }
        );
    }
}

