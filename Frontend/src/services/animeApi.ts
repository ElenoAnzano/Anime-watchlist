const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface RatingSummary {
  animeId: number
  average: number
  count: number
}

export interface Comment {
  id: number
  animeId: number
  content: string
  createdAt: string
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const details = body?.details ? ` (${body.details.join(', ')})` : ''
    throw new Error(`${body?.error ?? 'Request failed'}${details}`)
  }
  return body as T
}

export function getAllRatings() {
  return request<RatingSummary[]>('/api/ratings')
}

export function getRating(animeId: number) {
  return request<RatingSummary>(`/api/ratings/anime/${animeId}`)
}

export function createRating(animeId: number, score: number) {
  return request<{ summary: RatingSummary }>('/api/ratings', {
    method: 'POST',
    body: JSON.stringify({ animeId, score }),
  })
}

export function getComments(animeId: number) {
  return request<Comment[]>(`/api/comments/anime/${animeId}`)
}

export function createComment(animeId: number, content: string) {
  return request<Comment>('/api/comments', {
    method: 'POST',
    body: JSON.stringify({ animeId, content }),
  })
}
