import { describe, it, expect } from 'vitest';
import {
  tokenizePrismaCode,
  getTokenClasses,
  TokenType
} from './SyntaxTokenizedEditor';

describe('SyntaxTokenizedEditor Lexer & Tokenizer', () => {
  it('correctly tokenizes single-line comments with opacity/italic styling', () => {
    const code = '// Query all students';
    const tokens = tokenizePrismaCode(code);

    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe('comment');
    expect(tokens[0].text).toBe('// Query all students');

    const classes = getTokenClasses(tokens[0].type);
    expect(classes).toContain('text-slate-500/75');
    expect(classes).toContain('italic');
  });

  it('correctly tokenizes multi-line comments', () => {
    const code = '/* Multiline\n   comment */';
    const tokens = tokenizePrismaCode(code);

    expect(tokens.some(t => t.type === 'comment')).toBe(true);
    const commentToken = tokens.find(t => t.type === 'comment');
    expect(commentToken?.text).toBe('/* Multiline\n   comment */');
  });

  it('accurately tokenizes complex Prisma query expressions', () => {
    const code = `const result = await prisma.student.findMany({
  where: {
    gpa: { gte: 3.5 },
    status: "ACTIVE"
  }
});`;

    const tokens = tokenizePrismaCode(code);

    // Keywords
    const constToken = tokens.find(t => t.text === 'const');
    expect(constToken?.type).toBe('keyword');

    const awaitToken = tokens.find(t => t.text === 'await');
    expect(awaitToken?.type).toBe('keyword');

    // Prisma Root
    const prismaToken = tokens.find(t => t.text === 'prisma');
    expect(prismaToken?.type).toBe('prisma-root');
    expect(getTokenClasses('prisma-root')).toContain('text-sky-400');

    // Model Delegate
    const studentToken = tokens.find(t => t.text === 'student');
    expect(studentToken?.type).toBe('prisma-model');
    expect(getTokenClasses('prisma-model')).toContain('text-cyan-300');

    // Prisma Method
    const methodToken = tokens.find(t => t.text === 'findMany');
    expect(methodToken?.type).toBe('prisma-method');
    expect(getTokenClasses('prisma-method')).toContain('text-blue-400');

    // Clauses
    const whereToken = tokens.find(t => t.text === 'where');
    expect(whereToken?.type).toBe('prisma-clause');
    expect(getTokenClasses('prisma-clause')).toContain('text-pink-400');

    // Operators
    const gteToken = tokens.find(t => t.text === 'gte');
    expect(gteToken?.type).toBe('prisma-operator');
    expect(getTokenClasses('prisma-operator')).toContain('text-orange-400');

    // Strings
    const stringToken = tokens.find(t => t.text === '"ACTIVE"');
    expect(stringToken?.type).toBe('string');
    expect(getTokenClasses('string')).toContain('text-emerald-400');

    // Numbers
    const numberToken = tokens.find(t => t.text === '3.5');
    expect(numberToken?.type).toBe('primitive');
    expect(getTokenClasses('primitive')).toContain('text-amber-300');
  });

  it('distinguishes property keys followed by colon', () => {
    const code = '{ customField: true }';
    const tokens = tokenizePrismaCode(code);

    const keyToken = tokens.find(t => t.text === 'customField');
    expect(keyToken?.type).toBe('property-key');
    expect(getTokenClasses('property-key')).toContain('text-sky-200');

    const boolToken = tokens.find(t => t.text === 'true');
    expect(boolToken?.type).toBe('primitive');
  });
});
