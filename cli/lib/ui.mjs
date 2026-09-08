export const ui = {
  divider: () => console.log('────────────────────────────────────────────────────────────'),
  heading: (text) => console.log(text),
  success: (text) => console.log(`✓ ${text}`),
  error: (text) => console.error(`✗ ${text}`),
  info: (text) => console.log(`ℹ ${text}`),
  warning: (text) => console.log(`⚠ ${text}`),
  step: (num, text) => console.log(`${num}. ${text}`)
};
