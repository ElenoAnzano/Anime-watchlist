<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAnimeStore } from '@/stores/anime'

const animeStore = useAnimeStore()
const apiError = ref('')

onMounted(async () => {
  // allSettled so `loading` only turns off once every request has finished.
  const results = await Promise.allSettled([
    animeStore.loadAnime(),
    animeStore.loadWatchlist(),
    animeStore.loadRatings(),
  ])
  animeStore.loading = false

  const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected')
  if (failed) {
    apiError.value = (failed.reason as Error).message
  }
})
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/anime" class="brand">Anime Watchlist</RouterLink>

      <RouterLink to="/anime">Browse</RouterLink>

      <RouterLink to="/watchlist">
        My Watchlist
        <span v-if="animeStore.watchlist.length" class="count">{{ animeStore.watchlist.length }}</span>
      </RouterLink>
    </nav>
  </header>

  <p v-if="apiError" class="api-banner">
    {{ apiError }} Anime, your watchlist, ratings and comments won't load until it is.
  </p>

  <RouterView />
</template>

<style>
:root {
  --bg: #f6f7fb;
  --surface: #ffffff;
  --surface-2: #eceef5;
  --border: #d9dce6;
  --text: #1a1d29;
  --muted: #5f6475;
  --accent: #5b4de0;
  --accent-contrast: #ffffff;
  --star: #d98b00;
  --error: #c62828;
  --success: #2e7d32;
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #11131b;
    --surface: #1a1d29;
    --surface-2: #232736;
    --border: #2f3445;
    --text: #eceef5;
    --muted: #9aa0b4;
    --accent: #8b7fff;
    --accent-contrast: #11131b;
    --star: #ffc03d;
    --error: #ff6b6b;
    --success: #6fcf73;
    color-scheme: dark;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
}

main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 64px;
}

section {
  margin-top: 32px;
}

a {
  color: var(--accent);
}

button,
.button {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: var(--accent);
  color: var(--accent-contrast);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

button.secondary {
  background: transparent;
  color: var(--accent);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input,
select,
textarea {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font: inherit;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.muted {
  color: var(--muted);
}

.error {
  color: var(--error);
}

.success {
  color: var(--success);
}

.back {
  display: inline-block;
  margin-bottom: 16px;
  text-decoration: none;
}

header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

header nav {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px 16px;
}

header nav a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
}

header nav a.router-link-active {
  color: var(--text);
}

header nav .brand {
  margin-right: auto;
  color: var(--accent);
  font-size: 1.15rem;
}

.count {
  display: inline-block;
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-contrast);
  font-size: 0.75rem;
  text-align: center;
}

.api-banner {
  margin: 0;
  padding: 10px 16px;
  background: var(--error);
  color: #fff;
  text-align: center;
}
</style>
