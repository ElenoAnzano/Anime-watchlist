<script setup lang="ts">
import { computed } from 'vue'
import { useAnimeStore, type Anime } from '@/stores/anime'

const props = defineProps<{
  anime: Anime
}>()

const animeStore = useAnimeStore()
const rating = computed(() => animeStore.ratings[props.anime.id])
</script>

<template>
  <article class="anime-card">
    <RouterLink :to="`/anime/${anime.id}`" class="poster">
      <img :src="anime.image" :alt="anime.title" loading="lazy" />
      <span class="type-badge">{{ anime.type }}</span>
      <span v-if="animeStore.isInWatchlist(anime.id)" class="saved-badge" title="In My Watchlist">
        ✓ Saved
      </span>
    </RouterLink>

    <div class="anime-card-content">
      <h2>{{ anime.title }}</h2>

      <p class="rating">
        <template v-if="rating">
          ★ {{ rating.average.toFixed(1) }}
          <span class="muted">({{ rating.count }})</span>
        </template>
        <span v-else class="muted">No ratings yet</span>
      </p>

      <RouterLink :to="`/anime/${anime.id}`" class="button">View details</RouterLink>
    </div>
  </article>
</template>

<style scoped>
.anime-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.15s, border-color 0.15s;
}

.anime-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
}

.poster {
  position: relative;
  display: block;
  aspect-ratio: 5 / 7;
  background: var(--surface-2);
}

.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.type-badge,
.saved-badge {
  position: absolute;
  top: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.type-badge {
  left: 8px;
  background: rgb(0 0 0 / 0.7);
  color: #fff;
}

.saved-badge {
  right: 8px;
  background: var(--accent);
  color: var(--accent-contrast);
}

.anime-card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  flex: 1;
}

h2 {
  font-size: 1rem;
  margin: 0;
}

.rating {
  margin: 0;
  color: var(--star);
  font-weight: 600;
}

.button {
  margin-top: auto;
  text-align: center;
}
</style>
