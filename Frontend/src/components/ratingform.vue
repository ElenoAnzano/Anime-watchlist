<script setup lang="ts">
import { ref } from 'vue'
import { createRating } from '@/services/animeApi'
import { useAnimeStore } from '@/stores/anime'

const props = defineProps<{
  animeId: number
}>()

const animeStore = useAnimeStore()

const hovered = ref(0)
const submitted = ref(0)
const saving = ref(false)
const error = ref('')

async function rate(score: number) {
  saving.value = true
  error.value = ''
  try {
    const { summary } = await createRating(props.animeId, score)
    animeStore.setRating(summary)
    submitted.value = score
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="rating-form">
    <div class="stars" role="group" aria-label="Rate this anime" @mouseleave="hovered = 0">
      <button
        v-for="star in 5"
        :key="star"
        class="star"
        :class="{ filled: star <= (hovered || submitted) }"
        :disabled="saving"
        :aria-label="`Rate ${star} out of 5`"
        @mouseenter="hovered = star"
        @click="rate(star)"
      >
        ★
      </button>
    </div>

    <p v-if="submitted" class="success">Thanks! You rated this {{ submitted }}/5.</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.stars {
  display: flex;
  gap: 4px;
}

.star {
  background: none;
  border: none;
  padding: 0 2px;
  font-size: 2rem;
  line-height: 1;
  color: var(--border);
  cursor: pointer;
}

.star.filled {
  color: var(--star);
}

.star:disabled {
  cursor: wait;
}
</style>
