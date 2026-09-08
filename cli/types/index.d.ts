// Type definitions for Claude Anti-Slop

export interface MemoryItem {
  filename: string;
  content: string;
  category: string;
  path: string;
}

export interface MemoryCategory {
  [filename: string]: string;
}

export interface MemoryData {
  standards: MemoryCategory;
  patterns: MemoryCategory;
  'anti-patterns': MemoryCategory;
  examples: MemoryCategory;
  templates: MemoryCategory;
}

export interface ScanResult {
  success: boolean;
  message: string;
  data: {
    templates: number;
    antiPatterns: number;
    examples: number;
    files: string[];
  };
}

export interface SearchResult {
  success: boolean;
  message: string;
  data: {
    results: MemoryItem[];
    count: number;
    query: string;
    category: string;
  };
}

export interface QualityCheckResult {
  success: boolean;
  message: string;
  data: {
    issues: QualityIssue[];
    score: number;
  };
}

export interface QualityIssue {
  rule: string;
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
}

export interface StatusData {
  active: boolean;
  memoryInitialized: boolean;
  memoryPath: string;
  categories: string[];
  itemCount: number;
}

export interface SyncBackup {
  name: string;
  size: number;
  modified: Date;
  location: 'drive' | 'local';
}

export interface TemplateInfo {
  name: string;
  description: string;
  files: string[];
  stack: string;
}

export interface CLIConfig {
  locale?: string;
  features?: {
    autoSync?: boolean;
    syncPath?: string;
  };
}

export interface UIOptions {
  quiet?: boolean;
  json?: boolean;
  verbose?: boolean;
}

export interface CommandOptions {
  repo?: string;
  query?: string;
  category?: string;
  filename?: string;
  content?: string;
  code?: string;
  language?: string;
  locale?: string;
  limit?: number;
  force?: boolean;
  auto?: boolean;
  path?: string;
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: string;
}
