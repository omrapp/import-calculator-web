/** Renders a DOM node to a PNG data URL, skipping `data-export-ignore` parts. */
export async function nodeToPng(node: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image');
  return toPng(node, {
    pixelRatio: 2,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    filter: child =>
      !(
        child instanceof HTMLElement && child.dataset.exportIgnore !== undefined
      ),
  });
}
