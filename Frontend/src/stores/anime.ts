import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { getAllRatings, type RatingSummary } from '@/services/animeApi'

export interface Episode {
  id: number
  animeId: number
  episodeNumber: number
  title: string
  youtubeId: string
}

export interface Anime {
  id: number
  title: string
  description: string
  image: string
  genre: string[]
  type: 'TV' | 'Movie'
  episodes: Episode[]
}

const WATCHLIST_KEY = 'anime-watchlist'

const catalog: Anime[] = [
  {
    id: 1,
    title: "The Exiled Heavy Knight Knows How to Game the System",
    description:
      "Elymas Edvaughn is exiled from his prestigious family after awakening the Heavy Knight class, which is considered defective. However, he realizes that this world is identical to a VR game he played in his previous life, giving him knowledge that he can use to overcome the class’s weaknesses and change his fate.",
    image: "/The Exiled Heavy Knight Knows How to Game the System.jpg",
    genre: ["Action", "Adventure", "Fantasy"],
    type: "TV",
    episodes: [
      {
        id: 1,
        animeId: 1,
        episodeNumber: 1,
        title: "I'm Elymas the Heavy Knight",
        youtubeId: "jfC6u5K7CMU",
      },
      {
        id: 2,
        animeId: 1,
        episodeNumber: 2,
        title: "Menacing Foul Eight-Legged Beast",
        youtubeId: "SsUJxNIL1Ps",
      },
      {
        id: 3,
        animeId: 1,
        episodeNumber: 3,
        title: "The Raid Quest",
        youtubeId: "jJwjh7mJCQo",
      },
    ],
  },
  {
    id: 2,
    title: "BLACK TORCH",
    description: "Jiro Azuma, a descendant of ninjas who can communicate with animals, rescues an injured black cat named Rago. He soon discovers that Rago is actually a legendary supernatural being called the Black Star of Doom, drawing Jiro into a secret war against powerful mononoke.",
    image: "/BLACKTORCH.jpg",
    genre: ["Action", "Adventure", "Drama", "Supernatural"],
    type: "TV",
    episodes: [
      {
        id: 4,
        animeId: 2,
        episodeNumber: 1,
        title: "The Future Is in Our Hands",
        youtubeId: "QkGzBAbBMng",
      },
      {
        id: 5,
        animeId: 2,
        episodeNumber: 2,
        title: "The Choice Is Yours",
        youtubeId: "HPVDw--9H4g",
      },
      {
        id: 6,
        animeId: 2,
        episodeNumber: 3,
        title: "WHAT'S MY NAME?",
        youtubeId: "EkUl6QRHOBk",
      },
    ],
  },
  {
    id: 3,
    title: "Isekai Office Worker: The Other World's Books Depend on the Bean Counter",
    description:
      "Seiichirou Kondou, an overworked office worker, is accidentally transported to another world during a Holy Maiden summoning. Instead of asking for riches or power, he asks for a job and begins working in the kingdom's Royal Accounting Department.",
    image: "/Isekai Office Worker The Other World's Books Depend on the Bean Counter.jpg",
    genre: ["Fantasy", "Isekai", "Drama", "Romance"],
    type: "TV",
    episodes: [
      {
        id: 7,
        animeId: 3,
        episodeNumber: 1,
        title: "I Got a Job",
        youtubeId: "SsRiK9Kn0I0",
      },
      {
        id: 8,
        animeId: 3,
        episodeNumber: 2,
        title: "I Got Promoted",
        youtubeId: "U2mLqm3gDl4",
      },
      {
        id: 9,
        animeId: 3,
        episodeNumber: 3,
        title: "I Got a Manager",
        youtubeId: "ReQUlr6MsP8",
      },
    ],
  },
  {
    id: 4,
    title: "Demon Slayer: Kimetsu no Yaiba The Hinokami Chronicles",
    description:
      "Follow Tanjiro Kamado's journey through the story of Demon Slayer: Kimetsu no Yaiba, recreated through the cutscenes of The Hinokami Chronicles video game.",
    image: "/Demon Slayer Kimetsu no Yaiba The Hinokami Chronicles.jpg",
    genre: ["Action", "Adventure", "Fantasy"],
    type: "Movie",
    episodes: [
      {
        id: 10,
        animeId: 4,
        episodeNumber: 1,
        title: "All Cutscenes [English Dub]",
        youtubeId: "GCJnG6DYEeg",
      },
    ],
  },
  {
    id: 5,
    title: "Easygoing Territory Defense by the Optimistic Lord",
    description:
      "Van Ney Fertio, a young noble with Production Magic, is exiled to a remote frontier village because his ability is considered useless. Using his unique magic and optimistic attitude, Van begins transforming the poor village into a thriving and well-defended territory.",
    image: "/Easygoing Territory Defense by the Optimistic Lord.jpg",
    genre: ["Fantasy", "Isekai", "Adventure"],
    type: "Movie",
    episodes: [
      {
        id: 11,
        animeId: 5,
        episodeNumber: 1,
        title: "Full Story",
        youtubeId: "UUE4n_lcu2s",
      },
    ],
  },
  {
    id: 6,
    title: "Look Back",
    description:
      "Ayumu Fujino, a confident young manga artist, meets the talented and reclusive Kyomoto. Their shared passion for drawing manga brings them together, leading to a friendship and creative journey that changes both of their lives.",
    image: "/LookBack.jpg",
    genre: ["Drama", "Slice of Life"],
    type: "Movie",
    episodes: [
      {
        id: 12,
        animeId: 6,
        episodeNumber: 1,
        title: "Look Back",
        youtubeId: "_XlTffQPI6w",
      },
    ],
  },
]

function loadWatchlist(): number[] {
  try {
    const saved = JSON.parse(localStorage.getItem(WATCHLIST_KEY) ?? '[]')
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'number') : []
  } catch {
    return []
  }
}

export const useAnimeStore = defineStore('anime', () => {
  const animeList = ref<Anime[]>(catalog)
  const watchlistIds = ref<number[]>(loadWatchlist())
  const ratings = ref<Record<number, RatingSummary>>({})

  watch(
    watchlistIds,
    (ids) => localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids)),
    { deep: true },
  )

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

  function toggleWatchlist(id: number) {
    if (isInWatchlist(id)) {
      watchlistIds.value = watchlistIds.value.filter((animeId) => animeId !== id)
    } else {
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
    watchlist,
    genres,
    ratings,
    getAnime,
    getEpisode,
    isInWatchlist,
    toggleWatchlist,
    loadRatings,
    setRating,
  }
})
