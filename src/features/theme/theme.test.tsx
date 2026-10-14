import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getTheme,
  initTheme,
  nextTheme,
  readSavedTheme,
  resolveTheme,
  setTheme,
  STORAGE_KEY,
} from './theme';
import { ThemeToggle } from './ThemeToggle';

function mockSystemDark(dark: boolean) {
  const listeners: ((event: { matches: boolean }) => void)[] = [];
  window.matchMedia = vi.fn().mockReturnValue({
    matches: dark,
    addEventListener: (_: string, listener: (typeof listeners)[number]) =>
      listeners.push(listener),
  });
  return (matches: boolean) =>
    listeners.forEach(listener => listener({ matches }));
}

const root = document.documentElement;

beforeEach(() => {
  localStorage.clear();
  root.classList.remove('dark');
  document.head.innerHTML = '<meta name="theme-color" content="" />';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('theme', () => {
  it('defaults to system and resolves it from the OS', () => {
    expect(readSavedTheme()).toBe('system');
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('cycles system → light → dark → system', () => {
    expect(nextTheme('system')).toBe('light');
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('system');
  });

  it('applies and persists a chosen theme', () => {
    mockSystemDark(false);
    initTheme();
    setTheme('dark');
    expect(root).toHaveClass('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#0b1423',
    );
    setTheme('light');
    expect(root).not.toHaveClass('dark');
  });

  it('follows OS changes only while on system', () => {
    const emit = mockSystemDark(false);
    initTheme('system');
    expect(root).not.toHaveClass('dark');
    emit(true);
    expect(root).toHaveClass('dark');
    setTheme('light');
    emit(true);
    expect(root).not.toHaveClass('dark');
  });

  it('keeps working when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readSavedTheme()).toBe('system');
    expect(() => setTheme('dark')).not.toThrow();
    expect(getTheme()).toBe('dark');
  });
});

describe('ThemeToggle', () => {
  it('names the current theme and switches to the next one', () => {
    mockSystemDark(false);
    initTheme('system');
    render(<ThemeToggle />);
    const button = screen.getByRole('button', {
      name: 'Theme: System. Switch to Light',
    });
    act(() => fireEvent.click(button));
    expect(getTheme()).toBe('light');
    expect(
      screen.getByRole('button', { name: 'Theme: Light. Switch to Dark' }),
    ).toBeInTheDocument();
  });
});
