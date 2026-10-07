import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  addToWatchlist,
  getAllAnime,
  getAllRatings,
  getWatchlist,
  removeFromWatchlist,
  type Anime,
  type RatingSummary,
} from '@/services/animeApi'

export type { Anime, Episode } from '@/services/animeApi'

export const useAnimeStore = defineStore('anime', () => {
  // Anime and episodes come from the Anime / Episode tables via the API.
  const animeList = ref<Anime[]>([])
  // True until the initial load in app.vue finishes, so views can tell
  // "still loading" apart from "not found".
  const loading = ref(true)
  // Mirror of the WatchlistItem table; the backend is the source of truth.
  const watchlistIds = ref<number[]>([])
  const ratings = ref<Record<number, RatingSummary>>({})

  const watchlist = computed(() =>
    animeList.value.filter((anime) => watchlistIds.value.includes(anime.id)),
  )

  const genres = computed(() =>
    [...new Set(animeList.value.flatMap((anime) => anime.genre))].sort(),
  )

  function getAnime(id: number) {
    return animeList.value.find((anime) => anime.id === id)
  }

  function getEpisode(episodeId: number) {
    for (const anime of animeList.value) {
      const episode = anime.episodes.find((e) => e.id === episodeId)
      if (episode) return { anime, episode }
    }
    return undefined
  }

  function isInWatchlist(id: number) {
    return watchlistIds.value.includes(id)
  }

  async function loadAnime() {
    animeList.value = await getAllAnime()
  }

  async function loadWatchlist() {
    const items = await getWatchlist()
    watchlistIds.value = items.map((item) => item.animeId)
  }

  // Updates local state only after the backend confirms the change.
  async function toggleWatchlist(id: number) {
    if (isInWatchlist(id)) {
      await removeFromWatchlist(id)
      watchlistIds.value = watchlistIds.value.filter((animeId) => animeId !== id)
    } else {
      await addToWatchlist(id)
      watchlistIds.value.push(id)
    }
  }

  async function loadRatings() {
    const summaries = await getAllRatings()
    ratings.value = Object.fromEntries(summaries.map((s) => [s.animeId, s]))
  }

  function setRating(summary: RatingSummary) {
    ratings.value[summary.animeId] = summary
  }

  return {
    animeList,
    loading,
    watchlist,
    genres,
    ratings,
    getAnime,
    getEpisode,
    isInWatchlist,
    loadAnime,
    loadWatchlist,
    toggleWatchlist,
    loadRatings,
    setRating,
  }
})
