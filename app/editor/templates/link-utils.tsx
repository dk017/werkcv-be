import { createContext, type CSSProperties, type ReactNode, useContext } from "react";

function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
    return /^\+?[0-9()\-\s]{7,}$/.test(value);
}

function isLikelyUrl(value: string): boolean {
    return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(value);
}

function toHref(value: string): string | null {
    const v = value.trim();
    if (!v) return null;
    if (isEmail(v)) return `mailto:${v}`;
    if (isPhone(v)) return `tel:${v.replace(/\s+/g, "")}`;
    if (isLikelyUrl(v)) {
        return /^https?:\/\//i.test(v) ? v : `https://${v}`;
    }
    return null;
}

interface LinkTextProps {
    value: string;
    className?: string;
    style?: CSSProperties;
}

const LinkTextContext = createContext({ disableAnchors: false });

interface LinkTextProviderProps {
    disableAnchors?: boolean;
    children: ReactNode;
}

export function LinkTextProvider({ disableAnchors = false, children }: LinkTextProviderProps) {
    return (
        <LinkTextContext.Provider value={{ disableAnchors }}>
            {children}
        </LinkTextContext.Provider>
    );
}

export function LinkText({ value, className, style }: LinkTextProps) {
    const { disableAnchors } = useContext(LinkTextContext);
    const href = toHref(value);
    const baseStyle: CSSProperties = {
        color: "inherit",
        wordBreak: "break-all",
        ...style,
    };

    if (!href || disableAnchors) {
        return (
            <span className={className} style={baseStyle}>
                {value}
            </span>
        );
    }

    const isHttp = href.startsWith("http://") || href.startsWith("https://");

    return (
        <a
            href={href}
            className={className}
            style={{ ...baseStyle, textDecoration: "underline" }}
            target={isHttp ? "_blank" : undefined}
            rel={isHttp ? "noopener noreferrer" : undefined}
        >
            {value}
        </a>
    );
}



