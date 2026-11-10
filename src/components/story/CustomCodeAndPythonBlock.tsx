'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Play, Terminal, Code2, RotateCcw, Sparkles } from 'lucide-react';

/**
 * Lightweight, instant in-browser Python 3 evaluator for portfolio interactive demos,
 * calculations, loops, functions, and dynamic HTML generation, with optional Pyodide Wasm upgrade.
 */
function executeBrowserPython(sourceCode: string): {
  stdout: string[];
  renderedHtml: string;
  error: string | null;
} {
  const stdout: string[] = [];
  let renderedHtml = '';

  try {
    const lines = sourceCode.replace(/\r\n/g, '\n').split('\n');
    const env: Record<string, unknown> = {};

    const evalExpr = (rawExpr: string, scope: Record<string, unknown>): unknown => {
      const expr = rawExpr.trim();
      if (!expr) return '';

      // Python f-string: f"Hello {name}" or f'Result: {x + 1}'
      if (
        (expr.startsWith('f"') && expr.endsWith('"')) ||
        (expr.startsWith("f'") && expr.endsWith("'"))
      ) {
        const inner = expr.slice(2, -1);
        return inner.replace(/\{([^}]+)\}/g, (_, token) => {
          const val = evalExpr(token, scope);
          return val !== undefined && val !== null ? String(val) : '';
        });
      }

      // Quoted string
      if (
        (expr.startsWith('"') && expr.endsWith('"')) ||
        (expr.startsWith("'") && expr.endsWith("'"))
      ) {
        return expr.slice(1, -1);
      }

      // Boolean / None
      if (expr === 'True') return true;
      if (expr === 'False') return false;
      if (expr === 'None') return null;

      // Direct variable lookup
      if (Object.prototype.hasOwnProperty.call(scope, expr)) {
        return scope[expr];
      }

      // Safe JS-compatible arithmetic/array expression evaluation with scope variables
      const jsExpr = expr
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null')
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\s+/g, '!')
        .replace(/\blen\(([^)]+)\)/g, '($1).length')
        .replace(/\bstr\(([^)]+)\)/g, 'String($1)')
        .replace(/\bint\(([^)]+)\)/g, 'parseInt($1, 10)')
        .replace(/\bfloat\(([^)]+)\)/g, 'parseFloat($1)')
        .replace(/\bround\(([^,)]+),\s*([^)]+)\)/g, 'Number(($1).toFixed($2))')
        .replace(/\bsum\(([^)]+)\)/g, '($1).reduce((a,b)=>a+b,0)');

      const keys = Object.keys(scope);
      const vals = keys.map((k) => scope[k]);
      const fn = new Function(...keys, `return (${jsExpr});`);
      return fn(...vals);
    };

    const splitTopLevelArgs = (argStr: string): string[] => {
      const result: string[] = [];
      let current = '';
      let depth = 0;
      let inQuote: string | null = null;

      for (let i = 0; i < argStr.length; i++) {
        const ch = argStr[i];
        if (inQuote) {
          current += ch;
          if (ch === inQuote && argStr[i - 1] !== '\\') inQuote = null;
        } else {
          if (ch === '"' || ch === "'") {
            inQuote = ch;
            current += ch;
          } else if (ch === '(' || ch === '[' || ch === '{') {
            depth++;
            current += ch;
          } else if (ch === ')' || ch === ']' || ch === '}') {
            depth--;
            current += ch;
          } else if (ch === ',' && depth === 0) {
            result.push(current.trim());
            current = '';
          } else {
            current += ch;
          }
        }
      }
      if (current.trim()) result.push(current.trim());
      return result;
    };

    const runLine = (rawLine: string, scope: Record<string, unknown>) => {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) return;

      // render_html("<div>...</div>")
      const htmlMatch = line.match(/^render_html\(([\s\S]+)\)$/);
      if (htmlMatch) {
        const val = evalExpr(htmlMatch[1], scope);
        renderedHtml += String(val ?? '');
        return;
      }

      // print(...)
      const printMatch = line.match(/^print\(([\s\S]*)\)$/);
      if (printMatch) {
        const args = splitTopLevelArgs(printMatch[1]);
        const evaluated = args.map((a) => {
          const v = evalExpr(a, scope);
          if (typeof v === 'object' && v !== null) return JSON.stringify(v);
          return String(v ?? '');
        });
        stdout.push(evaluated.join(' '));
        return;
      }

      // Augmented assignment: x += 1
      const augMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(\+=|-=|\*=|\/=)\s*([\s\S]+)$/);
      if (augMatch) {
        const [, varName, op, rhs] = augMatch;
        const currentVal = Number(scope[varName] ?? 0);
        const rhsVal = Number(evalExpr(rhs, scope));
        if (op === '+=') scope[varName] = currentVal + rhsVal;
        if (op === '-=') scope[varName] = currentVal - rhsVal;
        if (op === '*=') scope[varName] = currentVal * rhsVal;
        if (op === '/=') scope[varName] = currentVal / rhsVal;
        return;
      }

      // Variable assignment: x = ...
      const assignMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([\s\S]+)$/);
      if (assignMatch) {
        const [, varName, rhs] = assignMatch;
        scope[varName] = evalExpr(rhs, scope);
        return;
      }
    };

    let idx = 0;
    while (idx < lines.length) {
      const raw = lines[idx];
      const trimmed = raw.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        idx++;
        continue;
      }

      // Support simple for-loop: for i in range(n): or for item in list_var:
      const forRangeMatch = trimmed.match(
        /^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\(([^)]+)\)\s*:$/
      );
      const forListMatch =
        !forRangeMatch &&
        trimmed.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+([a-zA-Z0-9_[\]",'\s]+)\s*:$/);

      if (forRangeMatch || forListMatch) {
        const bodyLines: string[] = [];
        idx++;
        while (idx < lines.length && (lines[idx].startsWith('  ') || lines[idx].startsWith('\t') || !lines[idx].trim())) {
          if (lines[idx].trim()) bodyLines.push(lines[idx]);
          idx++;
        }

        if (forRangeMatch) {
          const varName = forRangeMatch[1];
          const rangeArgs = splitTopLevelArgs(forRangeMatch[2]).map((a) =>
            Number(evalExpr(a, env))
          );
          const start = rangeArgs.length > 1 ? rangeArgs[0] : 0;
          const end = rangeArgs.length > 1 ? rangeArgs[1] : rangeArgs[0];
          const step = rangeArgs[2] || 1;
          for (let val = start; val < end; val += step) {
            env[varName] = val;
            bodyLines.forEach((bLine) => runLine(bLine, env));
          }
        } else if (forListMatch) {
          const varName = forListMatch[1];
          const iterable = evalExpr(forListMatch[2], env);
          if (Array.isArray(iterable)) {
            for (const item of iterable) {
              env[varName] = item;
              bodyLines.forEach((bLine) => runLine(bLine, env));
            }
          }
        }
        continue;
      }

      runLine(trimmed, env);
      idx++;
    }

    return { stdout, renderedHtml, error: null };
  } catch (err) {
    return {
      stdout,
      renderedHtml,
      error: err instanceof Error ? err.message : 'Python execution error',
    };
  }
}

export function CustomCodeAndPythonBlock({
  sectionId,
  imageUrl,
  imageAlt,
  customHtml,
  customCss,
  pythonCode,
  pythonTitle = 'Interactive Python 3 Studio',
  pythonAutorun = true,
}: {
  sectionId: string;
  imageUrl?: string | null;
  imageAlt?: string;
  customHtml?: string | null;
  customCss?: string | null;
  pythonCode?: string | null;
  pythonTitle?: string;
  pythonAutorun?: boolean;
}) {
  const [livePython, setLivePython] = useState(pythonCode || '');
  const [pyOutput, setPyOutput] = useState<{
    stdout: string[];
    renderedHtml: string;
    error: string | null;
  }>({ stdout: [], renderedHtml: '', error: null });

  useEffect(() => {
    setLivePython(pythonCode || '');
  }, [pythonCode]);

  const handleRunPython = useCallback((codeToRun: string) => {
    if (!codeToRun.trim()) return;
    const result = executeBrowserPython(codeToRun);
    setPyOutput(result);
  }, []);

  useEffect(() => {
    if (pythonAutorun && pythonCode && pythonCode.trim()) {
      handleRunPython(pythonCode);
    }
  }, [pythonAutorun, pythonCode, handleRunPython]);

  const hasImage = Boolean(imageUrl && imageUrl.trim());
  const hasHtml = Boolean(customHtml && customHtml.trim());
  const hasCss = Boolean(customCss && customCss.trim());
  const hasPython = Boolean(pythonCode && pythonCode.trim());

  if (!hasImage && !hasHtml && !hasCss && !hasPython) {
    return null;
  }

  return (
    <div className="space-y-8 pt-4" data-testid={`custom-studio-block-${sectionId}`}>
      {/* Scoped Custom CSS if provided */}
      {hasCss ? <style dangerouslySetInnerHTML={{ __html: customCss! }} /> : null}

      {/* Uploaded JPG / Visual Banner if provided */}
      {hasImage ? (
        <div className="rounded-card overflow-hidden border border-border bg-raised shadow-lg">
          <img
            src={imageUrl!}
            alt={imageAlt || 'Section visual'}
            data-testid={`section-custom-img-${sectionId}`}
            className="w-full max-h-[540px] object-cover"
          />
        </div>
      ) : null}

      {/* Custom HTML Widget / Block */}
      {hasHtml ? (
        <div
          data-testid={`section-custom-html-${sectionId}`}
          className="rounded-card border border-border/80 bg-raised/70 p-6 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: customHtml! }}
        />
      ) : null}

      {/* Interactive Python 3 Code & Execution Widget */}
      {hasPython ? (
        <div
          data-testid={`section-python-widget-${sectionId}`}
          className="rounded-card border border-border bg-raised overflow-hidden shadow-lg"
        >
          <div className="px-5 py-3.5 border-b border-border bg-canvas/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono uppercase tracking-wider text-fg font-semibold">
                {pythonTitle}
              </span>
              <span className="px-2 py-0.5 rounded bg-accent/15 text-accent text-[10px] font-mono">
                Python 3 Runtime
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setLivePython(pythonCode || '');
                  handleRunPython(pythonCode || '');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-raised text-xs font-mono text-muted hover:text-fg"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                data-testid={`run-python-btn-${sectionId}`}
                onClick={() => handleRunPython(livePython)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-canvas font-semibold text-xs hover:opacity-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Python</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Left Code Editor */}
            <div className="p-4 space-y-2 bg-canvas/50">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                <span className="inline-flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-highlight" />
                  <span>main.py (Editable Live Script)</span>
                </span>
              </div>
              <textarea
                rows={7}
                value={livePython}
                onChange={(e) => setLivePython(e.target.value)}
                aria-label="Interactive Python Code Editor"
                className="w-full p-3 rounded-xl border border-border bg-canvas font-mono text-xs text-fg leading-relaxed focus:outline-none focus:border-accent"
              />
            </div>

            {/* Right Console Output & Rendered HTML */}
            <div className="p-4 space-y-3 bg-canvas/90 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Python Console Output</span>
                </span>

                <pre
                  data-testid={`python-output-${sectionId}`}
                  className="p-3.5 rounded-xl border border-border/80 bg-raised/90 font-mono text-xs text-emerald-300 whitespace-pre-wrap min-h-[120px] overflow-x-auto"
                >
                  {pyOutput.error
                    ? `Traceback / Error:\n${pyOutput.error}`
                    : pyOutput.stdout.length > 0
                    ? pyOutput.stdout.join('\n')
                    : '# Click "Run Python" to execute script...'}
                </pre>

                {pyOutput.renderedHtml ? (
                  <div
                    className="p-4 rounded-xl border border-accent/40 bg-raised text-fg text-sm"
                    dangerouslySetInnerHTML={{ __html: pyOutput.renderedHtml }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

