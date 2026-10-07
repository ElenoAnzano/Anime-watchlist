<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAnimeStore } from '@/stores/anime'
import { getRating } from '@/services/animeApi'
import EpisodeCard from '@/components/episodecard.vue'
import RatingForm from '@/components/ratingform.vue'
import CommentSection from '@/components/commentsection.vue'

const route = useRoute()
const animeStore = useAnimeStore()

const anime = computed(() => animeStore.getAnime(Number(route.params.id)))
const rating = computed(() => (anime.value ? animeStore.ratings[anime.value.id] : undefined))

const inWatchlist = computed(() =>
  anime.value ? animeStore.isInWatchlist(anime.value.id) : false,
)

const watchlistSaving = ref(false)
const watchlistError = ref('')

async function toggleWatchlist() {
  if (!anime.value) return
  watchlistSaving.value = true
  watchlistError.value = ''
  try {
    await animeStore.toggleWatchlist(anime.value.id)
  } catch (e) {
    watchlistError.value = (e as Error).message
  } finally {
    watchlistSaving.value = false
  }
}

// Refresh anime's rating from the API whenever the page opens.
watch(
  () => anime.value?.id,
  async (id) => {
    if (!id) return
    try {
      animeStore.setRating(await getRating(id))
    } catch {
    }
  },
  { immediate: true },
)
</script>

<template>
  <main v-if="anime">
    <RouterLink to="/anime" class="back">← All anime</RouterLink>

    <section class="anime-detail">
      <img :src="anime.image" :alt="anime.title" />

      <div class="info">
        <h1>{{ anime.title }}</h1>

        <dl>
          <dt>Type</dt>
          <dd>{{ anime.type }}</dd>
          <dt>Genre</dt>
          <dd>{{ anime.genre.join(', ') }}</dd>
          <dt>Episodes</dt>
          <dd>{{ anime.episodes.length }}</dd>
        </dl>

        <p class="rating">
          <template v-if="rating && rating.count > 0">
            ★ {{ rating.average.toFixed(1) }}
            <span class="muted">
              from {{ rating.count }} {{ rating.count === 1 ? 'rating' : 'ratings' }}
            </span>
          </template>
          <span v-else class="muted">No ratings yet</span>
        </p>

        <p>{{ anime.description }}</p>

        <button
          :class="{ secondary: inWatchlist }"
          :disabled="watchlistSaving"
          @click="toggleWatchlist"
        >
          {{ inWatchlist ? '✓ Remove from My Watchlist' : '+ Add to My Watchlist' }}
        </button>
        <p v-if="watchlistError" class="error">{{ watchlistError }}</p>
      </div>
    </section>

    <section>
      <h2>Episodes</h2>
      <div class="episodes">
        <EpisodeCard v-for="episode in anime.episodes" :key="episode.id" :episode="episode" />
      </div>
    </section>

    <section>
      <h2>Rate this anime</h2>
      <RatingForm :anime-id="anime.id" />
    </section>

    <section>
      <h2>Comments</h2>
      <CommentSection :anime-id="anime.id" />
    </section>
  </main>

  <main v-else-if="animeStore.loading">
    <p class="muted">Loading anime...</p>
  </main>

  <main v-else>
    <h1>Anime not found</h1>
    <RouterLink to="/anime" class="button">Back to all anime</RouterLink>
  </main>
</template>

<style scoped>
.anime-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.anime-detail img {
  width: 240px;
  max-width: 100%;
  aspect-ratio: 5 / 7;
  object-fit: cover;
  border-radius: 12px;
  background: var(--surface-2);
}

.info {
  flex: 1 1 300px;
}

h1 {
  margin-top: 0;
}

dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px 16px;
  margin: 0 0 12px;
}

dt {
  color: var(--muted);
}

dd {
  margin: 0;
}

.rating {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--star);
}

.rating .muted {
  font-size: 0.9rem;
  font-weight: 400;
}

.episodes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
