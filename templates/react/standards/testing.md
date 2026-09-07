# Testing Standards

## Test Structure

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders title correctly', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    await fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Rules

- Use React Testing Library (not Enzyme)
- Test user behavior, not implementation
- Use `describe` for component grouping
- Use `it` or `test` for individual cases
- Mock external dependencies
- Use `beforeEach` for setup
- Clean up with `afterEach`

## Queries Priority

1. `getByRole` (most accessible)
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

## Async Testing

```tsx
it('loads data', async () => {
  render(<MyComponent />);
  const loading = screen.getByText('Loading...');
  expect(loading).toBeInTheDocument();
  const content = await screen.findByText('Loaded');
  expect(content).toBeInTheDocument();
});
```

## Mocking

```tsx
jest.mock('@/lib/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mocked' }))
}));
```

## Coverage

- Aim for 80%+ coverage
- Focus on critical paths
- Test edge cases
- Include error scenarios
