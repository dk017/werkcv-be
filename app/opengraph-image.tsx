import { ImageResponse } from 'next/og';
import { buildOgImage } from '@/lib/og-image';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'WerkCV.be – Professioneel cv maken in België';

export default function Image() {
    return new ImageResponse(
        buildOgImage({
            title: 'Professioneel CV Maken in 5 Minuten',
            label: undefined,
            labelColor: '#FACC15',
        }),
        { width: 1200, height: 630 }
    );
}
