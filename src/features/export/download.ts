/** `import-calculation-2026-10-14.pdf` */
export const datedFilename = (extension: string, now = new Date()) =>
  `import-calculation-${now.toISOString().slice(0, 10)}.${extension}`;

export function downloadUrl(url: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadUrl(url, filename);
  // Let the browser start the download before releasing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
