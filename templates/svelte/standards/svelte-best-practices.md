# Svelte Best Practices

## Component Structure

```svelte
<script>
  import { onMount } from 'svelte';
  
  // Props
  export let title = '';
  export let count = 0;
  
  // Reactive state
  let loading = false;
  let error = null;
  
  // Derived values
  $: doubled = count * 2;
  $: formatted = title.toUpperCase();
  
  // Functions
  async function fetchData() {
    loading = true;
    try {
      // Fetch logic
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
  
  // Lifecycle
  onMount(() => {
    fetchData();
  });
</script>

<main>
  <h1>{formatted}</h1>
  <p>Count: {count} (doubled: {doubled})</p>
  
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">{error}</p>
  {/if}
</main>

<style>
  main {
    padding: 2rem;
  }
  
  .error {
    color: red;
  }
</style>
```

## Rules

- Use `<script>` for logic
- Use `export let` for props
- Use `$:` for reactive statements
- Use `onMount` for side effects
- Keep components small and focused
- Use Svelte stores for global state

## Naming

- Components: PascalCase (`UserProfile.svelte`)
- Files: Match component name
- Stores: `stores/xyz.js` (`stores/auth.js`)
- Utils: `utils/xyz.js` (`utils/format.js`)

## State Management

- Use `writable` for mutable state
- Use `readable` for derived state
- Use `derived` for computed values
- Keep stores small and focused

## Stores

```javascript
// stores/auth.js
import { writable } from 'svelte/store';

export const user = writable(null);
export const token = writable(localStorage.getItem('token'));

export const isAuthenticated = derived([token], ($token) => !!$token);

export async function login(credentials) {
  const response = await api.login(credentials);
  token.set(response.token);
  user.set(response.user);
  localStorage.setItem('token', response.token);
}

export function logout() {
  token.set(null);
  user.set(null);
  localStorage.removeItem('token');
}
```

## Tips

- Use Svelte's reactivity (`$:`)
- Avoid unnecessary stores
- Use context for deep prop drilling
- Keep CSS scoped to components
- Use SvelteKit for routing
