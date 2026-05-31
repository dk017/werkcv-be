export function parseDecimal(value: string): number {
    const trimmed = value.trim().replace(/\s+/g, "");

    if (!trimmed) {
        return NaN;
    }

    if (trimmed.includes(",") && trimmed.includes(".")) {
        return parseFloat(trimmed.replace(/\./g, "").replace(",", "."));
    }

    if (trimmed.includes(",")) {
        return parseFloat(trimmed.replace(",", "."));
    }

    if (trimmed.includes(".")) {
        const parts = trimmed.split(".");
        if (parts.length > 1 && parts[parts.length - 1].length === 3) {
            return parseFloat(parts.join(""));
        }
    }

    return parseFloat(trimmed);
}

export function formatEuro(amount: number, maximumFractionDigits = 2): string {
    return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: maximumFractionDigits === 0 ? 0 : 2,
        maximumFractionDigits,
    }).format(amount);
}

export function createUtcDate(value: string): Date | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return date;
}

export function daysInMonth(year: number, monthIndex: number): number {
    return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export function addMonths(date: Date, monthsToAdd: number): Date {
    const totalMonths = (date.getUTCFullYear() * 12) + date.getUTCMonth() + monthsToAdd;
    const year = Math.floor(totalMonths / 12);
    const month = totalMonths % 12;
    const day = Math.min(date.getUTCDate(), daysInMonth(year, month));
    return new Date(Date.UTC(year, month, day));
}

export function diffDays(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / 86400000);
}
