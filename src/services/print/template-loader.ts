export const loadTemplate = async (templatePath: string): Promise<string> => {
    const response = await fetch(templatePath);
    if (!response.ok) {
        throw new Error(`No se pudo cargar el template: ${templatePath}`);
    }
    return await response.text();
};

export const fillTemplate = (template: string, replacements: Record<string, string>): string => {
    let result = template;
    for (const [key, value] of Object.entries(replacements)) {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    return result;
};
