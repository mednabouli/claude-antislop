# Pinia Store Patterns

## Basic Store

```javascript
// stores/counter.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0);
  const name = ref('Counter');

  // Getters
  const doubleCount = computed(() => count.value * 2);

  // Actions
  function increment() {
    count.value++;
  }

  function incrementBy(amount) {
    count.value += amount;
  }

  async function fetchCount() {
    const response = await fetch('/api/count');
    count.value = await response.json();
  }

  return { count, name, doubleCount, increment, incrementBy, fetchCount };
});
```

## Store with Setup Syntax

```javascript
// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.user?.name || 'Guest'
  },

  actions: {
    async login(credentials) {
      this.isLoading = true;
      try {
        const response = await api.login(credentials);
        this.token = response.token;
        this.user = response.user;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
    }
  }
});
```

## Usage in Components

```vue
<script setup>
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { user, isLoggedIn } = storeToRefs(userStore);

async function handleLogin() {
  await userStore.login({ email, password });
}
</script>
```

## Best Practices

- Use `defineStore` with setup syntax
- Keep stores focused (single responsibility)
- Use getters for computed state
- Use actions for async operations
- Avoid mutating state outside actions
- Use `storeToRefs` for destructuring

## Patterns

### Auth Store
```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials) {
    const response = await api.auth.login(credentials);
    token.value = response.token;
    user.value = response.user;
    localStorage.setItem('token', response.token);
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  return { user, token, isAuthenticated, login, logout };
});
```

### CRUD Store
```javascript
export const useItemsStore = defineStore('items', () => {
  const items = ref([]);
  const loading = ref(false);

  async function fetchItems() {
    loading.value = true;
    items.value = await api.items.getAll();
    loading.value = false;
  }

  async function createItem(data) {
    const item = await api.items.create(data);
    items.value.push(item);
    return item;
  }

  async function updateItem(id, data) {
    const item = await api.items.update(id, data);
    const index = items.value.findIndex(i => i.id === id);
    items.value[index] = item;
    return item;
  }

  async function deleteItem(id) {
    await api.items.delete(id);
    items.value = items.value.filter(i => i.id !== id);
  }

  return { items, loading, fetchItems, createItem, updateItem, deleteItem };
});
```

## Tips

- Name stores after their domain (`user`, `product`, `cart`)
- Keep stores small and focused
- Use composables for complex logic
- Persist data with plugins if needed
- Test stores in isolation
