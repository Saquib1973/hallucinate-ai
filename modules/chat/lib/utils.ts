export function parseMessageContent(content: string): string {
    if (!content) return "";
    let textContent = content;
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            textContent = parsed
                .filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('\n');
        }
    } catch (e) {
    }
    return textContent;
}

export function preprocessLaTeX(content: string): string {
    if (!content) return "";
    return content
        .replace(/\\\[/g, '$$$$')
        .replace(/\\\]/g, '$$$$')
        .replace(/\\\(/g, '$')
        .replace(/\\\)/g, '$');
}

export function getMessageText(msg: any): string {
    let contentToRender = "";
    if (msg.parts && Array.isArray(msg.parts)) {
        contentToRender = msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n');
    }
    if (!contentToRender && msg.text) contentToRender = msg.text;
    if (!contentToRender && msg.content) {
        if (typeof msg.content === 'string' && msg.content.trim().startsWith('[')) {
            contentToRender = parseMessageContent(msg.content);
        } else {
            contentToRender = msg.content;
        }
    }
    return contentToRender;
}
