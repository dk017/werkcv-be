/**
 * Shared OG image layout for all route-level opengraph-image.tsx files.
 * Returns a JSX element to pass into ImageResponse.
 * 1200 × 630 px, brutalist style matching the site.
 */

export function buildOgImage({
    title,
    label,
    labelColor = '#FACC15',
    isEnglish = false,
}: {
    title: string;
    label?: string;
    labelColor?: string;
    isEnglish?: boolean;
}) {
    // Truncate very long titles so they fit in 2 lines
    const displayTitle = title.length > 72 ? title.slice(0, 69) + '…' : title;

    const checkItems = isEnglish
        ? ['13+ templates', 'ATS-friendly', 'Instant PDF']
        : ['13+ templates', 'ATS-vriendelijk', 'Direct PDF'];

    const priceLabel = isEnglish ? 'one-time' : 'eenmalig';

    return (
        <div
            style={{
                display: 'flex',
                width: 1200,
                height: 630,
                backgroundColor: '#FFFEF0',
                fontFamily: '"Arial Black", Arial, Helvetica, sans-serif',
            }}
        >
            {/* ── Left panel ── */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '60px 64px',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 34, fontWeight: 900, color: '#000', lineHeight: 1 }}>Werk</span>
                    <span
                        style={{
                            fontSize: 34,
                            fontWeight: 900,
                            color: '#000',
                            backgroundColor: '#FACC15',
                            padding: '2px 10px',
                            lineHeight: 1,
                        }}
                    >
                        CV
                    </span>
                    <span style={{ fontSize: 34, fontWeight: 900, color: '#000', lineHeight: 1 }}>.nl</span>
                </div>

                {/* Label badge + Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {label && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                alignSelf: 'flex-start',
                            }}
                        >
                            <span
                                style={{
                                    backgroundColor: labelColor,
                                    color: '#000',
                                    fontSize: 16,
                                    fontWeight: 900,
                                    padding: '6px 14px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    border: '3px solid black',
                                }}
                            >
                                {label}
                            </span>
                        </div>
                    )}
                    <div
                        style={{
                            fontSize: displayTitle.length > 45 ? 52 : 64,
                            fontWeight: 900,
                            color: '#000',
                            lineHeight: 1.08,
                            letterSpacing: '-1px',
                        }}
                    >
                        {displayTitle}
                    </div>
                </div>

                {/* Footer tagline */}
                <div style={{ fontSize: 22, color: '#666', fontWeight: 700 }}>
                    werkcv.nl · professioneel cv maken · eenmalig €4,99
                </div>
            </div>

            {/* ── Right accent strip ── */}
            <div
                style={{
                    width: 260,
                    backgroundColor: '#FACC15',
                    borderLeft: '8px solid #000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0,
                    padding: '40px 28px',
                }}
            >
                <div style={{ fontSize: 100, fontWeight: 900, color: '#000', lineHeight: 1 }}>€4,99</div>
                <div
                    style={{
                        fontSize: 17,
                        fontWeight: 900,
                        color: '#000',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        marginBottom: 28,
                    }}
                >
                    {priceLabel}
                </div>

                {/* Divider */}
                <div style={{ width: '100%', height: 3, backgroundColor: '#000', marginBottom: 24 }} />

                {/* Check items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                    {checkItems.map((item) => (
                        <div
                            key={item}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                fontSize: 16,
                                fontWeight: 900,
                                color: '#000',
                            }}
                        >
                            <span
                                style={{
                                    width: 22,
                                    height: 22,
                                    backgroundColor: '#000',
                                    color: '#FACC15',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 13,
                                    fontWeight: 900,
                                    flexShrink: 0,
                                }}
                            >
                                ✓
                            </span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

