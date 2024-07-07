import shiki from 'shiki';

export async function getHighlighter() {
  const highlighter = await shiki.getHighlighter({
    theme: 'nord'
  });

  return async (markdown: string): Promise<string> => {
    const codeBlocks = markdown.match(/```(\w+)\n[\s\S]*?```/g);
    if (codeBlocks) {
      for (const block of codeBlocks) {
        const match = block.match(/```(\w+)\n([\s\S]*?)```/);
        if (match) {
          const [, lang, content] = match;
          const highlighted = await highlighter.codeToHtml(content, { lang });
          markdown = markdown.replace(block, highlighted);
        }
      }
    }
    return markdown;
  };
}
