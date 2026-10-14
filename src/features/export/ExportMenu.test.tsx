import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { calculate, type CalculationLink } from '@/features/calc-engine';
import { standardInput } from '@/features/calc-engine/fixtures';

import { ExportMenu } from './ExportMenu';

const toPng = vi.fn<(node: HTMLElement) => Promise<string>>();
const renderPdf = vi.fn<() => Promise<Blob>>();
vi.mock('html-to-image', () => ({ toPng: (node: HTMLElement) => toPng(node) }));
vi.mock('./pdf/renderPdf', () => ({ renderPdf: () => renderPdf() }));

const link: CalculationLink = {
  v: 1,
  input: standardInput(),
  rates: { source: 'manual' },
};
const result = calculate(link.input);

let downloads: string[];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-10-14T09:00:00Z') });
  downloads = [];
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloads.push(this.download);
  });
  URL.createObjectURL = vi.fn(() => 'blob:pdf');
  URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  toPng.mockReset();
  renderPdf.mockReset();
});

function renderMenu() {
  const content = document.createElement('article');
  render(<ExportMenu link={link} result={result} content={content} />);
  return content;
}

const click = (name: string) =>
  act(async () => {
    fireEvent.click(screen.getByRole('button', { name }));
  });

describe('ExportMenu', () => {
  it('downloads the Result as a dated PNG', async () => {
    toPng.mockResolvedValue('data:image/png;base64,AAAA');
    const content = renderMenu();
    await click('Download image');
    expect(toPng).toHaveBeenCalledWith(content);
    expect(downloads).toEqual(['import-calculation-2026-10-14.png']);
  });

  it('downloads a dated PDF', async () => {
    renderPdf.mockResolvedValue(new Blob(['%PDF']));
    renderMenu();
    await click('Download PDF');
    expect(renderPdf).toHaveBeenCalledOnce();
    expect(downloads).toEqual(['import-calculation-2026-10-14.pdf']);
  });

  it('shows an inline error when a file cannot be made', async () => {
    renderPdf.mockRejectedValue(new Error('font failed'));
    renderMenu();
    await click('Download PDF');
    expect(screen.getByRole('alert')).toHaveTextContent('try Print instead');
    expect(screen.getByRole('button', { name: 'Download PDF' })).toBeEnabled();
  });

  it('prints', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    renderMenu();
    await click('Print');
    expect(print).toHaveBeenCalledOnce();
  });
});
