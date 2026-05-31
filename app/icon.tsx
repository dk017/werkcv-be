import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#4ECDC4',
                    borderRadius: '6px',
                    fontFamily: 'serif',
                    fontWeight: 900,
                    fontSize: 20,
                    color: '#000',
                    letterSpacing: '-1px',
                }}
            >
                W
            </div>
        ),
        { ...size }
    );
}
