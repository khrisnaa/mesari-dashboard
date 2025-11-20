export function cleanFlashMessage(message: string | null | undefined): string {
    if (!message) return '';

    return message.replace(/-#.*?#/g, '').trim();
}
