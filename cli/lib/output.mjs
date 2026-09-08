import { ui } from './ui.mjs';

export function formatOutput(data, options = {}) {
  const { json, quiet } = options;

  if (!data) {
    return { success: false, error: 'No data provided' };
  }

  if (json) {
    return JSON.stringify({ success: true, ...data }, null, 2);
  }

  if (quiet) {
    return '';
  }

  if (data.message) {
    ui.success(data.message);
  }

  if (data.details) {
    ui.info(data.details);
  }

  return { success: true, message: 'Output formatted' };
}

export function createErrorResponse(error) {
  return {
    success: false,
    error: error.message || 'Unknown error',
    timestamp: new Date().toISOString()
  };
}

export function createResponse(data) {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };
}
