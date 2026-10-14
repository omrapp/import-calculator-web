/**
 * Evaluates what users type into number fields: a plain number or a small
 * arithmetic expression (`1200*3+45`). Hand-written recursive descent parser,
 * so user input never reaches eval/Function.
 *
 * Returns null for empty input and NaN for anything invalid.
 */
export function evaluateExpression(raw: string): number | null {
  const source = normalize(raw);
  if (source === '') return null;

  let pos = 0;
  const peek = () => source[pos];

  // expression := term (('+' | '-') term)*
  function expression(): number {
    let value = term();
    while (peek() === '+' || peek() === '-') {
      const op = source[pos++];
      const right = term();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }

  // term := factor (('*' | '/') factor)*
  function term(): number {
    let value = factor();
    while (peek() === '*' || peek() === '/') {
      const op = source[pos++];
      const right = factor();
      value = op === '*' ? value * right : value / right;
    }
    return value;
  }

  // factor := '-' factor | '(' expression ')' | number
  function factor(): number {
    if (peek() === '-') {
      pos++;
      return -factor();
    }
    if (peek() === '(') {
      pos++;
      const value = expression();
      if (source[pos++] !== ')') return NaN;
      return value;
    }
    const match = /^\d+(\.\d+)?|^\.\d+/.exec(source.slice(pos));
    if (!match) return NaN;
    pos += match[0].length;
    return Number(match[0]);
  }

  const value = expression();
  return pos === source.length && Number.isFinite(value) ? value : NaN;
}

function normalize(raw: string): string {
  return (
    raw
      // Arabic-Indic and Extended (Persian) digits → Latin
      .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06f0))
      .replace(/٫/g, '.') // Arabic decimal separator
      .replace(/[,٬\s]/g, '') // thousands separators and spaces
      .replace(/[×xX]/g, '*')
      .replace(/÷/g, '/')
      .replace(/[−–]/g, '-')
  );
}
