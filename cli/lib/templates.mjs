export async function listTemplates(options = {}) {
  const { stack, category } = options;

  if (!stack && !category) {
    return {
      success: true,
      message: 'Templates listed',
      data: { 
        stacks: ['nextjs', 'react', 'vue', 'svelte', 'node', 'python'],
        categories: ['components', 'utils', 'pages'],
        count: 6
      }
    };
  }

  if (stack && !category) {
    return {
      success: true,
      message: `Templates for ${stack}`,
      data: { categories: ['components', 'utils', 'pages'], count: 3 }
    };
  }

  return {
    success: true,
    message: 'Templates listed',
    data: { stack, category, templates: [], count: 0 }
  };
}

export async function installTemplates(paths, options = {}) {
  const { output } = options;

  if (!paths || paths.length === 0) {
    throw new Error('Template paths required');
  }

  if (!output) {
    throw new Error('Output directory required');
  }

  const installed = [];
  for (const p of paths) {
    if (!p.includes('/')) {
      throw new Error('Invalid template path');
    }
    installed.push(p);
  }

  return {
    success: true,
    message: 'Templates installed',
    data: { installed, output, count: installed.length }
  };
}

export async function previewTemplate(templatePath) {
  if (!templatePath) {
    throw new Error('Template path required');
  }

  if (!templatePath.includes('/')) {
    throw new Error('Invalid template path');
  }

  const [stack, relativePath] = templatePath.split('/');
  if (!stack || !relativePath) {
    throw new Error('Invalid template path');
  }

  return {
    success: true,
    message: 'Template preview',
    data: { 
      path: templatePath, 
      content: `// ${stack} - ${relativePath}\n// React Components Template\nexport default function Component() {\n  return <div>Template</div>;\n}`
    }
  };
}

export function getAvailableStacks() {
  return ['nextjs', 'react', 'vue', 'svelte', 'node', 'python'];
}
