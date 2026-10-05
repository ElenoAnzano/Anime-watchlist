<script setup lang="ts">
import { ref, watch } from 'vue'
import { createComment, getComments, type Comment } from '@/services/animeApi'

const props = defineProps<{
  animeId: number
}>()

const comments = ref<Comment[]>([])
const content = ref('')
const loading = ref(true)
const saving = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    comments.value = await getComments(props.animeId)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

async function submit() {
  if (!content.value.trim()) return
  saving.value = true
  error.value = ''
  try {
    const comment = await createComment(props.animeId, content.value)
    comments.value.unshift(comment)
    content.value = ''
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    saving.value = false
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

watch(() => props.animeId, load, { immediate: true })
</script>

<template>
  <div class="comment-section">
    <form @submit.prevent="submit">
      <textarea
        v-model="content"
        placeholder="Write a comment..."
        rows="3"
        maxlength="1000"
        aria-label="Write a comment"
      />
      <button type="submit" :disabled="saving || !content.trim()">
        {{ saving ? 'Posting...' : 'Submit' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="muted">Loading comments...</p>
    <p v-else-if="comments.length === 0 && !error" class="muted">No comments yet. Be the first!</p>

    <ul v-else class="comments">
      <li v-for="comment in comments" :key="comment.id">
        <p>{{ comment.content }}</p>
        <time class="muted" :datetime="comment.createdAt">{{ formatDate(comment.createdAt) }}</time>
      </li>
    </ul>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

textarea {
  width: 100%;
  resize: vertical;
}

.comments {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comments li {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
}

.comments p {
  margin: 0 0 4px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

time {
  font-size: 0.8rem;
}
</style>
