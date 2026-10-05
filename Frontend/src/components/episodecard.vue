<script setup lang="ts">
import type { Episode } from '@/stores/anime'

defineProps<{
  episode: Episode
  active?: boolean
}>()
</script>

<template>
  <RouterLink class="episode-card" :class="{ active }" :to="`/watch/${episode.id}`">
    <span class="number">Episode {{ episode.episodeNumber }}</span>
    <span class="title">{{ episode.title }}</span>
    <span class="play" aria-hidden="true">▶</span>
  </RouterLink>
</template>

<style scoped>
.episode-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  text-decoration: none;
}

.episode-card:hover,
.episode-card.active {
  border-color: var(--accent);
}

.number {
  color: var(--muted);
  font-size: 0.85rem;
  white-space: nowrap;
}

.title {
  flex: 1;
  font-weight: 600;
}

.play {
  color: var(--accent);
}
</style>
