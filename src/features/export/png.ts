/**
 * Renders a DOM node to a PNG data URL, skipping `data-export-ignore` parts.
 * `data-exporting` is set meanwhile so export-only parts (the brand header) show.
 */
export async function nodeToPng(node: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image');
  node.dataset.exporting = '';
  try {
    return await toPng(node, {
      pixelRatio: 2,
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      filter: child =>
        !(
          child instanceof HTMLElement &&
          child.dataset.exportIgnore !== undefined
        ),
    });
  } finally {
    delete node.dataset.exporting;
  }
}
