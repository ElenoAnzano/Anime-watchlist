<script setup lang="ts">
import { computed, ref } from 'vue'
import AnimeCard from '@/components/animecard.vue'
import AnimeFilter from '@/components/animefilter.vue'
import { useAnimeStore } from '@/stores/anime'

const props = defineProps<{
  watchlistOnly?: boolean
}>()

const animeStore = useAnimeStore()

const search = ref('')
const type = ref('All')
const genre = ref('All')

const filteredAnime = computed(() => {
  const source = props.watchlistOnly ? animeStore.watchlist : animeStore.animeList
  const query = search.value.trim().toLowerCase()

  return source.filter(
    (anime) =>
      (type.value === 'All' || anime.type === type.value) &&
      (genre.value === 'All' || anime.genre.includes(genre.value)) &&
      (!query || anime.title.toLowerCase().includes(query)),
  )
})
</script>

<template>
  <main>
    <h1>{{ watchlistOnly ? 'My Watchlist' : 'Browse Anime' }}</h1>

    <p v-if="animeStore.loading" class="muted">Loading anime...</p>

    <template v-else-if="watchlistOnly && animeStore.watchlist.length === 0">
      <p class="muted">Your watchlist is empty.</p>
      <RouterLink to="/anime" class="button">Browse anime</RouterLink>
    </template>

    <template v-else>
      <AnimeFilter
        v-model:search="search"
        v-model:type="type"
        v-model:genre="genre"
        :genres="animeStore.genres"
      />

      <section class="anime-grid">
        <AnimeCard v-for="anime in filteredAnime" :key="anime.id" :anime="anime" />
      </section>

      <p v-if="filteredAnime.length === 0" class="muted">No anime match your filters.</p>
    </template>
  </main>
</template>

<style scoped>
.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
}
</style>
