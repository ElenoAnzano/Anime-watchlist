<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAnimeStore } from '@/stores/anime'
import EpisodeCard from '@/components/episodecard.vue'

const route = useRoute()
const animeStore = useAnimeStore()

const found = computed(() => animeStore.getEpisode(Number(route.params.id)))
</script>

<template>
  <main v-if="found">
    <RouterLink :to="`/anime/${found.anime.id}`" class="back">← {{ found.anime.title }}</RouterLink>

    <h1>{{ found.anime.title }}</h1>
    <h2 v-if="found.anime.type === 'TV'">
      Episode {{ found.episode.episodeNumber }} — {{ found.episode.title }}
    </h2>

    <div class="player">
       <iframe
    :key="found.episode.youtubeId"
    :src="`https://www.youtube.com/embed/${found.episode.youtubeId}`"
    :title="found.episode.title"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
    </div>

    <section v-if="found.anime.episodes.length > 1">
      <h2>All episodes</h2>
      <div class="episodes">
        <EpisodeCard
          v-for="episode in found.anime.episodes"
          :key="episode.id"
          :episode="episode"
          :active="episode.id === found.episode.id"
        />
      </div>
    </section>
  </main>

  <main v-else-if="animeStore.loading">
    <p class="muted">Loading episode...</p>
  </main>

  <main v-else>
    <h1>Episode not found</h1>
    <RouterLink to="/anime" class="button">Back to all anime</RouterLink>
  </main>
</template>

<style scoped>
.player {
  position: relative;
  aspect-ratio: 16 / 9;
  max-width: 960px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.player iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.episodes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 960px;
}
</style>
