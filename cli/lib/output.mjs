import { ui } from './ui.mjs';
export function formatOutput(data, options = {}) {
  const { json = false, quiet = false } = options;
  if (json) return JSON.stringify(data, null, 2);
  if (quiet) return '';
  return null;
}
export function printOutput(data, options = {}) {
  const { json = false, quiet = false } = options;
  if (json) { console.log(JSON.stringify(data, null, 2)); return; }
  if (quiet) return;
  if (data.success !== undefined) {
    if (data.success) ui.success(data.message || 'Success');
    else ui.error(data.message || 'Failed');
  }
  if (data.data) console.log(JSON.stringify(data.data, null, 2));
  if (data.hint) { console.log(); ui.info(data.hint); }
}
export function createResponse(success, message, data = null, hint = null) {
  return { success, message, data, hint, timestamp: new Date().toISOString() };
}
export function createSuccessResponse(message, data = null, hint = null) {
  return createResponse(true, message, data, hint);
}
export function createErrorResponse(message, data = null, hint = null) {
  return createResponse(false, message, data, hint);
}
