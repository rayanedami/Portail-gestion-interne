export function formatDate(value, includeTime = true) {
    if (!value) {
        return "Date non disponible";
    }

    const text = String(value);
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);

    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "medium"
        }).format(new Date(Number(year), Number(month) - 1, Number(day)));
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return text;
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        ...(includeTime ? { timeStyle: "short" } : {})
    }).format(date);
}
