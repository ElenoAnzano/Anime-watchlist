import { createRouter, createWebHistory } from 'vue-router'

import AnimeWatchlist from '@/views/animewatchlist.vue'
import AnimeDetail from '@/views/animedetail.vue'
import WatchAnime from '@/views/watchanime.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/anime',
    },
    {
      path: '/anime',
      name: 'anime',
      component: AnimeWatchlist,
    },
    {
      path: '/watchlist',
      name: 'my-watchlist',
      component: AnimeWatchlist,
      props: { watchlistOnly: true },
    },
    {
      path: '/anime/:id',
      name: 'anime-detail',
      component: AnimeDetail,
    },
    {
      path: '/watch/:id',
      name: 'watch-anime',
      component: WatchAnime,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
