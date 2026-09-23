import React, { useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { EditorView, keymap } from '@codemirror/view';

export interface SyntaxTokenizedEditorProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => void;
  onRunQuery?: () => void;
  onPrimaryAction?: () => void;
  minHeight?: string;
  textareaRef?: any;
  placeholder?: string;
  readOnly?: boolean;
}

// Token Type definitions for Syntax Highlighting (preserved for parser tests & external consumers)
export type TokenType =
  | 'comment'
  | 'string'
  | 'keyword'
  | 'prisma-root'
  | 'prisma-model'
  | 'prisma-method'
  | 'prisma-clause'
  | 'prisma-operator'
  | 'primitive'
  | 'property-key'
  | 'punctuation'
  | 'identifier'
  | 'whitespace';

export interface Token {
  type: TokenType;
  text: string;
}

const KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'await',
  'async',
  'return',
  'function',
  'import',
  'export',
  'from',
  'if',
  'else',
  'new',
  'try',
  'catch',
  'finally',
  'throw',
  'typeof',
  'instanceof'
]);

const PRISMA_MODELS = new Set([
  'student',
  'students',
  'user',
  'users',
  'post',
  'posts',
  'course',
  'courses',
  'enrollment',
  'enrollments',
  'order',
  'orders',
  'product',
  'products',
  'category',
  'categories',
  'tag',
  'tags',
  'item',
  'items',
  'customer',
  'customers',
  'profile',
  'profiles',
  'author',
  'authors',
  'account',
  'accounts'
]);

const PRISMA_METHODS = new Set([
  'findMany',
  'findUnique',
  'findFirst',
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'deleteMany',
  'count',
  'aggregate',
  'groupBy'
]);

const PRISMA_CLAUSES = new Set([
  'where',
  'select',
  'include',
  'orderBy',
  'data',
  'take',
  'skip',
  'distinct',
  'cursor',
  'having',
  'by'
]);

const PRISMA_OPERATORS = new Set([
  'equals',
  'not',
  'in',
  'notIn',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'startsWith',
  'endsWith',
  'mode',
  'some',
  'every',
  'none',
  'is',
  'isNot',
  'AND',
  'OR',
  'NOT',
  'asc',
  'desc'
]);

const PRIMITIVES = new Set([
  'true',
  'false',
  'null',
  'undefined',
  'NaN',
  'Infinity'
]);

/**
 * High-performance Lexer Tokenizer for JavaScript / TypeScript / Prisma Client
 */
export function tokenizePrismaCode(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = code.length;

  while (i < len) {
    // 1. Whitespace
    if (/\s/.test(code[i])) {
      let ws = '';
      while (i < len && /\s/.test(code[i])) {
        ws += code[i];
        i++;
      }
      tokens.push({ type: 'whitespace', text: ws });
      continue;
    }

    // 2. Single-line Comment
    if (code[i] === '/' && code[i + 1] === '/') {
      let comment = '';
      while (i < len && code[i] !== '\n') {
        comment += code[i];
        i++;
      }
      tokens.push({ type: 'comment', text: comment });
      continue;
    }

    // 3. Multi-line Comment
    if (code[i] === '/' && code[i + 1] === '*') {
      let comment = '/*';
      i += 2;
      while (i < len && !(code[i] === '*' && code[i + 1] === '/')) {
        comment += code[i];
        i++;
      }
      if (i < len) {
        comment += '*/';
        i += 2;
      }
      tokens.push({ type: 'comment', text: comment });
      continue;
    }

    // 4. String Literals
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      let str = quote;
      i++;
      while (i < len && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < len) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      if (i < len) {
        str += code[i];
        i++;
      }
      tokens.push({ type: 'string', text: str });
      continue;
    }

    // 5. Numeric Literals
    if (/\d/.test(code[i])) {
      let num = '';
      while (i < len && /[\d.]/.test(code[i])) {
        num += code[i];
        i++;
      }
      tokens.push({ type: 'primitive', text: num });
      continue;
    }

    // 6. Word Token
    if (/[a-zA-Z_$]/.test(code[i])) {
      let word = '';
      while (i < len && /[a-zA-Z0-9_$]/.test(code[i])) {
        word += code[i];
        i++;
      }

      let lookahead = i;
      while (lookahead < len && /[ \t]/.test(code[lookahead])) {
        lookahead++;
      }
      const isColonFollowed = lookahead < len && code[lookahead] === ':' && code[lookahead + 1] !== ':';

      if (word === 'prisma') {
        tokens.push({ type: 'prisma-root', text: word });
      } else if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', text: word });
      } else if (PRISMA_METHODS.has(word)) {
        tokens.push({ type: 'prisma-method', text: word });
      } else if (PRISMA_CLAUSES.has(word)) {
        tokens.push({ type: 'prisma-clause', text: word });
      } else if (PRISMA_OPERATORS.has(word)) {
        tokens.push({ type: 'prisma-operator', text: word });
      } else if (PRIMITIVES.has(word)) {
        tokens.push({ type: 'primitive', text: word });
      } else if (PRISMA_MODELS.has(word.toLowerCase())) {
        tokens.push({ type: 'prisma-model', text: word });
      } else if (isColonFollowed) {
        tokens.push({ type: 'property-key', text: word });
      } else {
        tokens.push({ type: 'identifier', text: word });
      }
      continue;
    }

    // 7. Punctuation & Operators
    tokens.push({ type: 'punctuation', text: code[i] });
    i++;
  }

  return tokens;
}

/**
 * Returns tailored Tailwind CSS classes according to token type
 */
export function getTokenClasses(type: TokenType): string {
  switch (type) {
    case 'comment':
      return 'text-slate-500/75 italic';
    case 'string':
      return 'text-emerald-400 font-medium';
    case 'keyword':
      return 'text-purple-400 font-medium';
    case 'prisma-root':
      return 'text-sky-400 font-bold';
    case 'prisma-model':
      return 'text-cyan-300 font-medium';
    case 'prisma-method':
      return 'text-blue-400 font-medium';
    case 'prisma-clause':
      return 'text-pink-400 font-medium';
    case 'prisma-operator':
      return 'text-orange-400 font-medium';
    case 'primitive':
      return 'text-amber-300 font-medium';
    case 'property-key':
      return 'text-sky-200';
    case 'punctuation':
      return 'text-slate-400';
    case 'identifier':
      return 'text-slate-100';
    case 'whitespace':
    default:
      return '';
  }
}

// CodeMirror Professional Dark Theme with Adaptive Height Support
const prismaDarkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#02050B !important',
      color: '#f1f5f9',
      width: '100%',
      minHeight: '280px',
      fontSize: '13px',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    },
    '.cm-content': {
      caretColor: '#38bdf8',
      padding: '16px',
      lineHeight: '1.6',
      minHeight: '280px'
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#38bdf8',
      borderLeftWidth: '2px'
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#38bdf8'
    },
    '.cm-gutters': {
      backgroundColor: '#010408',
      color: '#475569',
      borderRight: '1px solid rgba(14, 165, 233, 0.15)',
      paddingRight: '6px',
      minHeight: '280px'
    },
    '.cm-lineNumbers .cm-gutterElement': {
      paddingLeft: '10px',
      paddingRight: '8px',
      fontSize: '11px'
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      color: '#38bdf8'
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(14, 165, 233, 0.04)'
    },
    '.cm-selectionMatch': {
      backgroundColor: 'rgba(56, 189, 248, 0.2)'
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: 'rgba(56, 189, 248, 0.25) !important'
    },
    '.cm-scroller': {
      overflow: 'auto',
      fontFamily: 'inherit',
      minHeight: '280px'
    }
  },
  { dark: true }
);

// CodeMirror Highlighting Style with 75% Opacity Italic Comments & Vivid Lexical Tokens
const prismaHighlightStyle = HighlightStyle.define([
  { tag: t.comment, color: '#64748b', fontStyle: 'italic', opacity: '0.75' },
  { tag: [t.keyword, t.controlKeyword, t.moduleKeyword], color: '#c084fc', fontWeight: '500' },
  { tag: [t.string, t.special(t.string)], color: '#4ade80' },
  { tag: [t.number, t.integer, t.float], color: '#facc15' },
  { tag: [t.bool, t.null], color: '#facc15' },
  { tag: [t.propertyName, t.definition(t.propertyName)], color: '#7dd3fc' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#60a5fa' },
  { tag: [t.operator, t.compareOperator, t.logicOperator], color: '#fb923c' },
  { tag: [t.punctuation, t.bracket], color: '#94a3b8' },
  { tag: t.variableName, color: '#f1f5f9' }
]);

export const SyntaxTokenizedEditor: React.FC<SyntaxTokenizedEditorProps> = ({
  value,
  onChange,
  onKeyDown,
  onRunQuery,
  onPrimaryAction,
  minHeight = '280px',
  placeholder = '// Write your Prisma query here...',
  readOnly = false
}) => {
  // Keep action ref updated so keymap closures always invoke current action
  const actionRef = useRef<(() => void) | undefined>(undefined);
  actionRef.current = onPrimaryAction || onRunQuery;

  const extensions = useMemo(() => {
    const ext = [
      javascript({ typescript: true }),
      syntaxHighlighting(prismaHighlightStyle),
      prismaDarkTheme,
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            if (actionRef.current) {
              actionRef.current();
              return true;
            }
            return false;
          }
        },
        {
          key: 'Ctrl-Enter',
          run: () => {
            if (actionRef.current) {
              actionRef.current();
              return true;
            }
            return false;
          }
        }
      ])
    ];

    return ext;
  }, []);

  return (
    <div
      className="relative w-full flex flex-col bg-[#02050B]"
      style={{ minHeight }}
      onKeyDown={onKeyDown}
    >
      <CodeMirror
        value={value}
        minHeight={minHeight}
        width="100%"
        className="w-full"
        theme="none"
        extensions={extensions}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: false,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: false,
          completionKeymap: false,
          lintKeymap: false
        }}
      />
    </div>
  );
};
