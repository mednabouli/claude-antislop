# React Components Standards

## Component Structure

```tsx
import React, { useState, useEffect } from 'react';

interface Props {
  title: string;
  count?: number;
}

export const MyComponent: React.FC<Props> = ({ title, count = 0 }) => {
  const [state, setState] = useState(0);

  useEffect(() => {
    // Side effects
  }, []);

  return <div>{title}: {count}</div>;
};
```

## Rules

- Use TypeScript for all components
- Define explicit prop interfaces
- Use functional components with hooks
- Avoid default exports; use named exports
- Keep components small and focused
- Use composition over inheritance

## Naming

- Components: PascalCase (`UserProfile`)
- Files: Match component name (`UserProfile.tsx`)
- Hooks: Prefix with `use` (`useAuth`)

## Props

- Use descriptive prop names
- Avoid boolean props with ambiguous names
- Prefer `onXyz` for callbacks
- Use `children` for content composition

## State Management

- Use `useState` for local state
- Use `useReducer` for complex state
- Lift state up when shared
- Avoid prop drilling; use context or composition

## Performance

- Memoize expensive calculations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `React.memo` for pure components
- Lazy load with `React.lazy` and `Suspense`

## Accessibility

- Use semantic HTML
- Add `aria-*` labels where needed
- Ensure keyboard navigation
- Test with screen readers

## Testing

- Write tests with Jest and React Testing Library
- Test user interactions, not implementation
- Mock external dependencies
- Aim for high coverage on critical paths
