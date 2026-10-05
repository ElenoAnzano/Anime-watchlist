<script setup lang="ts">
defineProps<{
  genres: string[]
}>()

const search = defineModel<string>('search', { required: true })
const type = defineModel<string>('type', { required: true })
const genre = defineModel<string>('genre', { required: true })

const types = ['All', 'TV', 'Movie']
</script>

<template>
  <div class="anime-filter">
    <input v-model="search" type="search" placeholder="Search anime..." aria-label="Search anime" />

    <div class="type-buttons" role="group" aria-label="Filter by type">
      <button
        v-for="option in types"
        :key="option"
        :class="{ active: type === option }"
        @click="type = option"
      >
        {{ option }}
      </button>
    </div>

    <select v-model="genre" aria-label="Filter by genre">
      <option value="All">All genres</option>
      <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
    </select>
  </div>
</template>

<style scoped>
.anime-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1 1 220px;
}

.type-buttons {
  display: flex;
  gap: 4px;
}

.type-buttons button {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.type-buttons button.active {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
}
</style>
