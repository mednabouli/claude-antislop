import { describe, it, expect } from '@jest/globals';
import { createResponse, createSuccessResponse, createErrorResponse, formatOutput, printOutput } from '../cli/lib/output.mjs';

describe('Output Utilities', () => {
  it('should create success response', () => {
    const response = createSuccessResponse('Test message', { data: 'test' });
    expect(response.success).toBe(true);
    expect(response.message).toBe('Test message');
    expect(response.data.data).toBe('test');
    expect(response.timestamp).toBeDefined();
  });

  it('should create error response', () => {
    const response = createErrorResponse('Error message');
    expect(response.success).toBe(false);
    expect(response.message).toBe('Error message');
  });

  it('should format JSON output', () => {
    const data = { test: 'value' };
    const formatted = formatOutput(data, { json: true });
    expect(formatted).toContain('"test": "value"');
  });

  it('should format quiet output', () => {
    const data = { test: 'value' };
    const formatted = formatOutput(data, { quiet: true });
    expect(formatted).toBe('');
  });
});
