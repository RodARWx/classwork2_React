/**
 * Pure expression evaluator and formatter for the Samsung One UI Calculator.
 */

const OPERATORS = ['+', '-', '×', '÷'];

export function isOperator(ch) {
  return OPERATORS.includes(ch);
}

/**
 * Formats a numeric value with thousands separators (e.g. 123,456)
 * while preserving decimals.
 */
export function formatResult(value) {
  if (value === 'Error' || value === null || value === undefined) return String(value ?? '');
  const num = Number(value);
  if (!Number.isFinite(num)) return 'Error';

  const rounded = Math.round(num * 1e10) / 1e10;
  const [intPart, decPart] = String(rounded).split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

/**
 * Safely evaluates a calculator expression string.
 * Returns a number, 'Error', or null if expression is incomplete.
 */
export function evaluateExpression(expr) {
  if (!expr || expr === 'Error') return null;

  try {
    // Auto-close any open parentheses for live preview
    const openCount = (expr.match(/\(/g) || []).length;
    const closeCount = (expr.match(/\)/g) || []).length;
    let balanced = expr;
    if (openCount > closeCount) {
      balanced += ')'.repeat(openCount - closeCount);
    }

    // Replace display symbols with JS math equivalents
    let jsExpr = balanced
      .replace(/,/g, '')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, `(${Math.E})`)
      .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/sin\(/g, 'Math.sin((Math.PI/180)*')
      .replace(/cos\(/g, 'Math.cos((Math.PI/180)*')
      .replace(/tan\(/g, 'Math.tan((Math.PI/180)*')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/\^/g, '**');

    // Strip trailing operator for live preview
    jsExpr = jsExpr.replace(/[+\-*/]+$/, '');
    if (!jsExpr) return null;

    // Validate allowed characters only
    if (!/^[0-9+\-*/().\sMathsqrtincoalgEPI*]+$/.test(jsExpr)) {
      return null;
    }

    const result = Function(`"use strict"; return (${jsExpr})`)();
    if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
      return 'Error';
    }
    return Math.round(result * 1e10) / 1e10;
  } catch {
    return null;
  }
}

/**
 * Handles smart parentheses insertion just like Samsung Calculator.
 */
export function appendParenthesis(expr) {
  if (expr === '0' || expr === 'Error') return '(';
  const openCount = (expr.match(/\(/g) || []).length;
  const closeCount = (expr.match(/\)/g) || []).length;
  const lastChar = expr.slice(-1);

  if (openCount > closeCount && (/[0-9)%πe]/.test(lastChar))) {
    return expr + ')';
  }
  if (isOperator(lastChar) || lastChar === '(') {
    return expr + '(';
  }
  return expr + '×(';
}

/**
 * Toggles the sign of the last number or wraps expression in (-...).
 */
export function toggleSign(expr) {
  if (expr === '0' || expr === 'Error') return '0';
  if (expr.startsWith('(-') && expr.endsWith(')')) {
    return expr.slice(2, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(expr)) {
    return expr.startsWith('-') ? expr.slice(1) : `-${expr}`;
  }
  return `(-${expr})`;
}
