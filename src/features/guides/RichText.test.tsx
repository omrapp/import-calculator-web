import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RichText } from './RichText';

describe('RichText', () => {
  it('renders bullets, numbered lines and bold', () => {
    const { container } = render(
      <RichText
        text={
          'Intro line\n• **First:** one\n• Second\n1. Step one\n2. Step two'
        }
      />,
    );
    expect(screen.getByText('Intro line').tagName).toBe('P');
    expect(container.querySelectorAll('ul > li')).toHaveLength(2);
    expect(container.querySelectorAll('ol > li')).toHaveLength(2);
    expect(screen.getByText('First:').tagName).toBe('STRONG');
    expect(screen.getByText('Step two')).toBeInTheDocument();
  });

  it('never injects HTML', () => {
    const { container } = render(
      <RichText text={'<script>alert(1)</script> **<b>x</b>**'} />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
    expect(container.textContent).toContain('<script>alert(1)</script>');
  });
});
