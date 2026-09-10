// =============================================================================
// PRISMALENS CURRICULUM CORE TYPES & DATA CONTRACTS
// =============================================================================

export type TaskType = 'guided' | 'independent' | 'stretch' | 'challenge' | 'project';

export interface TaskHint {
  level: number; // 1 = subtle direction, 2 = direct syntax hint
  text: string;
}

export interface PrismaValidationRule {
  targetModel?: string;                     // e.g. "user", "post", "product"
  requiredMethod?: 'findMany' | 'findUnique' | 'findFirst' | 'create' | 'createMany' | 'update' | 'updateMany' | 'upsert' | 'delete' | 'deleteMany' | '$transaction';
  requiredFieldsInSelect?: string[];        // e.g. ['id', 'email', 'name']
  forbiddenFieldsInSelect?: string[];       // e.g. ['password', 'hash']
  requiredIncludes?: string[];              // e.g. ['posts', 'profile', 'categories']
  requiredWhereClauses?: string[];          // e.g. ['email', 'status', 'createdAt']
  requiredOrderBy?: { field: string; direction?: 'asc' | 'desc' }[];
  requirePagination?: { take?: number; skip?: number; cursor?: boolean };
  expectFailure?: boolean;                  // Deliberate error lab (e.g. unique constraint violation)
  expectedErrorCode?: string;               // e.g. 'P2002' (unique key error), 'P2025' (not found)
  expectedRowCount?: number | { min?: number; max?: number };
  expectedResultSnippet?: Record<string, any>;
  codeContains?: string[];                  // Substrings or patterns required in code or schema
  codeExcludes?: string[];                  // Substrings or patterns forbidden in code or schema
  customValidator?: (codeAst: any, result: any, rawSql: string) => { valid: boolean; message?: string };
}

export interface PracticeTask {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  type: TaskType;
  targetModel: string;
  activeTab?: 'editor' | 'schema';          // Whether task edits TypeScript or schema.prisma
  initialCode: string;
  solutionCode: string;
  solutionExplanation: string;
  hints: TaskHint[];
  validation: PrismaValidationRule;
  successMessage: string;
}

export interface TargetHeroCode {
  code: string;
  language: 'typescript' | 'prisma' | 'bash';
  explanation: string;
  badge?: string; // e.g. "Target Pattern We'll Dissect", "The Production Query"
}

export interface StepBreakdown {
  stepNumber: number;
  stepTitle: string;
  codeSnippet: string;
  explanation: string;
  visualData?: {
    type: 'sql_lens' | 'type_preview' | 'table_diff' | 'erd_highlight';
    title: string;
    details: any;
  };
}

export interface ConceptMCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ConceptTheory {
  summary: string;
  targetHero: TargetHeroCode;
  explanation: string[];
  stepBreakdowns?: StepBreakdown[];
  keyTakeaway: string;
  commonMistakes?: string[];
  mcqs?: ConceptMCQ[];
  liveDemoCode?: string;
  liveDemoNotes?: string;
}

export interface Concept {
  id: string;
  order: number;
  title: string;
  shortDescription: string;
  theory: ConceptTheory;
  tasks: PracticeTask[]; // MUST HAVE AT LEAST 2 TASKS
  masteryPoints?: string[];
}

export interface DayChallenge {
  id: string;
  title: string;
  scenario: string;
  tasks: PracticeTask[];
}

export interface MilestoneData {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  daysRange: string;
  moduleIds: string[];
}

export interface ModuleData {
  id: string;
  slug: string;
  day: number;
  title: string;
  shortTitle: string;
  milestoneId: string;
  description: string;
  estimatedMinutes: number;
  completionLearnings: string[];
  concepts: Concept[];
  challenge: DayChallenge;
}

export type MilestoneInfo = MilestoneData;

export interface GeneratedSqlResult {
  sql: string;
  parameters: any[];
  executionPlan: string;
  durationMs: number;
  isIndexScan?: boolean;
  isNPlusOneWarning?: boolean;
  nPlusOneExplanation?: string;
}

// User state & progress
export interface UserProgressState {
  completedTaskIds: string[];
  completedConceptIds: string[];
  completedDayIds: string[];
  unlockedDayIds: string[];
  currentDayId: string;
  currentStep: 'theory' | 'practice' | 'challenge' | 'complete';
  currentConceptId?: string;
  currentTaskId?: string;
  streakDays: number;
  lastActiveDate: string; // ISO string
  xp: number;
  taskUserCode: Record<string, string>; // Saved code per task
}
