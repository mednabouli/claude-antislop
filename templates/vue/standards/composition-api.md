# Vue 3 Composition API Standards

## Component Structure

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
});

// Emits
const emit = defineEmits(['update', 'delete']);

// Reactive state
const loading = ref(false);
const error = ref(null);

// Computed
const formattedTitle = computed(() => props.title.toUpperCase());

// Methods
async function fetchData() {
  loading.value = true;
  try {
    // Fetch logic
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <h1>{{ formattedTitle }}</h1>
    <p>Count: {{ count }}</p>
  </div>
</template>

<style scoped>
/* Styles */
</style>
```

## Rules

- Use `<script setup>` syntax
- Define props with `defineProps()`
- Define emits with `defineEmits()`
- Use `ref()` for reactive state
- Use `computed()` for derived state
- Use lifecycle hooks (`onMounted`, `onUpdated`, etc.)
- Keep components focused (single responsibility)

## Naming

- Components: PascalCase (`UserProfile.vue`)
- Files: Match component name
- Composables: `useXyz` (`useAuth.js`)
- Stores: `useXxxStore` (`useUserStore.js`)

## State Management

- Use Pinia for global state
- Use composables for local state
- Avoid prop drilling
- Use provide/inject for deep nesting

## API Calls

- Use composables for API logic
- Handle loading states
- Handle errors gracefully
- Use axios or fetch

## Testing

- Use Vitest for unit tests
- Use Vue Test Utils
- Test user interactions
- Mock API calls

## Performance

- Use `v-memo` for expensive renders
- Lazy load components
- Use `shallowRef` for large objects
- Avoid unnecessary reactivity
