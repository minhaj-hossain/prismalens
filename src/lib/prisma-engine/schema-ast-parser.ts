// =============================================================================
// PRISMA SCHEMA AST PARSER
// =============================================================================

export interface ParsedRelation {
  name?: string;
  targetModel: string;
  fields?: string[];
  references?: string[];
  onDelete?: 'Cascade' | 'SetNull' | 'Restrict' | 'NoAction' | 'SetDefault';
  onUpdate?: string;
}

export interface ParsedField {
  name: string;
  type: string;
  isList: boolean;
  isOptional: boolean;
  isId: boolean;
  isUnique: boolean;
  isUpdatedAt: boolean;
  defaultValue?: string;
  map?: string;
  relation?: ParsedRelation;
  rawAttributes: string[];
}

export interface ParsedModel {
  name: string;
  mappedName?: string;
  fields: ParsedField[];
  primaryKeys?: string[];
  uniqueConstraints?: string[][];
  indexes?: string[][];
}

export interface ParsedEnum {
  name: string;
  values: string[];
}

export interface ParsedSchema {
  models: ParsedModel[];
  enums: ParsedEnum[];
  datasource?: {
    name: string;
    provider: string;
    url: string;
  };
  generators: {
    name: string;
    provider: string;
  }[];
}

export function parsePrismaSchema(schemaText: string): ParsedSchema {
  if (!schemaText) {
    return { models: [], enums: [], generators: [] };
  }
  const models: ParsedModel[] = [];
  const enums: ParsedEnum[] = [];
  const generators: { name: string; provider: string }[] = [];
  let datasource: { name: string; provider: string; url: string } | undefined;

  // Clean comments and normalize lines
  const lines = schemaText.split('\n');
  let currentBlockType: 'model' | 'enum' | 'datasource' | 'generator' | null = null;
  let currentBlockName = '';
  let currentBlockLines: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Skip full comment or empty lines if outside block
    if (!line || line.startsWith('//')) {
      continue;
    }

    if (!currentBlockType) {
      if (line.startsWith('model ')) {
        const match = line.match(/^model\s+([A-Za-z0-9_]+)\s*\{?/);
        if (match) {
          currentBlockType = 'model';
          currentBlockName = match[1];
          currentBlockLines = [];
        }
      } else if (line.startsWith('enum ')) {
        const match = line.match(/^enum\s+([A-Za-z0-9_]+)\s*\{?/);
        if (match) {
          currentBlockType = 'enum';
          currentBlockName = match[1];
          currentBlockLines = [];
        }
      } else if (line.startsWith('datasource ')) {
        const match = line.match(/^datasource\s+([A-Za-z0-9_]+)\s*\{?/);
        if (match) {
          currentBlockType = 'datasource';
          currentBlockName = match[1];
          currentBlockLines = [];
        }
      } else if (line.startsWith('generator ')) {
        const match = line.match(/^generator\s+([A-Za-z0-9_]+)\s*\{?/);
        if (match) {
          currentBlockType = 'generator';
          currentBlockName = match[1];
          currentBlockLines = [];
        }
      }
    } else {
      // Inside a block
      if (line === '}' || line.endsWith('}')) {
        // End of block
        if (currentBlockType === 'model') {
          models.push(parseModelBlock(currentBlockName, currentBlockLines));
        } else if (currentBlockType === 'enum') {
          enums.push(parseEnumBlock(currentBlockName, currentBlockLines));
        } else if (currentBlockType === 'datasource') {
          datasource = parseDatasourceBlock(currentBlockName, currentBlockLines);
        } else if (currentBlockType === 'generator') {
          generators.push(parseGeneratorBlock(currentBlockName, currentBlockLines));
        }
        currentBlockType = null;
        currentBlockName = '';
        currentBlockLines = [];
      } else {
        currentBlockLines.push(line);
      }
    }
  }

  return { models, enums, datasource, generators };
}

function parseModelBlock(modelName: string, lines: string[]): ParsedModel {
  const fields: ParsedField[] = [];
  let mappedName: string | undefined;
  const primaryKeys: string[] = [];
  const uniqueConstraints: string[][] = [];
  const indexes: string[][] = [];

  for (const line of lines) {
    const cleaned = line.replace(/\/\/.*$/, '').trim();
    if (!cleaned) continue;

    // Check block-level directives
    if (cleaned.startsWith('@@map(')) {
      const match = cleaned.match(/@@map\(\s*["']([^"']+)["']\s*\)/);
      if (match) mappedName = match[1];
      continue;
    }

    if (cleaned.startsWith('@@id(')) {
      const match = cleaned.match(/@@id\(\s*\[(.*?)\]\s*\)/);
      if (match) {
        const cols = match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        primaryKeys.push(...cols);
      }
      continue;
    }

    if (cleaned.startsWith('@@unique(')) {
      const match = cleaned.match(/@@unique\(\s*\[(.*?)\]\s*\)/);
      if (match) {
        const cols = match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        uniqueConstraints.push(cols);
      }
      continue;
    }

    if (cleaned.startsWith('@@index(')) {
      const match = cleaned.match(/@@index\(\s*\[(.*?)\]\s*\)/);
      if (match) {
        const cols = match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        indexes.push(cols);
      }
      continue;
    }

    // Parse field line
    // e.g. "email String @unique" or "posts Post[]" or "authorId Int? @map("author_id")"
    const tokens = cleaned.split(/\s+/);
    if (tokens.length >= 2) {
      const fieldName = tokens[0];
      let rawType = tokens[1];
      let isList = false;
      let isOptional = false;

      if (rawType.endsWith('[]')) {
        isList = true;
        rawType = rawType.slice(0, -2);
      } else if (rawType.endsWith('?')) {
        isOptional = true;
        rawType = rawType.slice(0, -1);
      }

      const rawAttributes = tokens.slice(2);
      const isId = rawAttributes.some(a => a.startsWith('@id'));
      const isUnique = rawAttributes.some(a => a.startsWith('@unique'));
      const isUpdatedAt = rawAttributes.some(a => a.startsWith('@updatedAt'));

      // Find map
      let fieldMap: string | undefined;
      const mapAttr = rawAttributes.find(a => a.startsWith('@map('));
      if (mapAttr) {
        const m = mapAttr.match(/@map\(\s*["']([^"']+)["']\s*\)/);
        if (m) fieldMap = m[1];
      }

      // Find default
      let defaultValue: string | undefined;
      const defAttr = rawAttributes.find(a => a.startsWith('@default('));
      if (defAttr) {
        const m = cleaned.match(/@default\((.*?)\)/);
        if (m) defaultValue = m[1];
      }

      // Find relation
      let relation: ParsedRelation | undefined;
      const relAttr = cleaned.includes('@relation(');
      if (relAttr) {
        const relMatch = cleaned.match(/@relation\((.*?)\)/);
        if (relMatch) {
          const content = relMatch[1];
          const fieldsMatch = content.match(/fields:\s*\[(.*?)\]/);
          const refMatch = content.match(/references:\s*\[(.*?)\]/);
          const onDeleteMatch = content.match(/onDelete:\s*([A-Za-z]+)/);
          const onUpdateMatch = content.match(/onUpdate:\s*([A-Za-z]+)/);
          const nameMatch = content.match(/^["']([^"']+)["']/);

          relation = {
            targetModel: rawType,
            name: nameMatch ? nameMatch[1] : undefined,
            fields: fieldsMatch ? fieldsMatch[1].split(',').map(s => s.trim()) : undefined,
            references: refMatch ? refMatch[1].split(',').map(s => s.trim()) : undefined,
            onDelete: (onDeleteMatch ? onDeleteMatch[1] : undefined) as any,
            onUpdate: onUpdateMatch ? onUpdateMatch[1] : undefined
          };
        }
      } else if (!['String', 'Int', 'Float', 'Decimal', 'Boolean', 'DateTime', 'Json', 'BigInt', 'Bytes'].includes(rawType)) {
        // Probable relation field without explicit @relation attribute (e.g. posts Post[])
        relation = {
          targetModel: rawType
        };
      }

      fields.push({
        name: fieldName,
        type: rawType,
        isList,
        isOptional,
        isId,
        isUnique,
        isUpdatedAt,
        defaultValue,
        map: fieldMap,
        relation,
        rawAttributes
      });
    }
  }

  return {
    name: modelName,
    mappedName,
    fields,
    primaryKeys: primaryKeys.length > 0 ? primaryKeys : undefined,
    uniqueConstraints: uniqueConstraints.length > 0 ? uniqueConstraints : undefined,
    indexes: indexes.length > 0 ? indexes : undefined,
  };
}

function parseEnumBlock(enumName: string, lines: string[]): ParsedEnum {
  const values: string[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/\/\/.*$/, '').trim();
    if (cleaned && !cleaned.startsWith('@')) {
      values.push(cleaned);
    }
  }
  return { name: enumName, values };
}

function parseDatasourceBlock(name: string, lines: string[]) {
  let provider = 'postgresql';
  let url = 'env("DATABASE_URL")';

  for (const line of lines) {
    const cleaned = line.replace(/\/\/.*$/, '').trim();
    const providerMatch = cleaned.match(/provider\s*=\s*["']([^"']+)["']/);
    if (providerMatch) provider = providerMatch[1];
    const urlMatch = cleaned.match(/url\s*=\s*(.*)/);
    if (urlMatch) url = urlMatch[1];
  }

  return { name, provider, url };
}

function parseGeneratorBlock(name: string, lines: string[]) {
  let provider = 'prisma-client-js';
  for (const line of lines) {
    const cleaned = line.replace(/\/\/.*$/, '').trim();
    const providerMatch = cleaned.match(/provider\s*=\s*["']([^"']+)["']/);
    if (providerMatch) provider = providerMatch[1];
  }
  return { name, provider };
}
