const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

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

export interface WatchlistItem {
  id: number
  animeId: number
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

  // 204 No Content has no body to parse
  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const details = body?.details ? ` (${body.details.join(', ')})` : ''
    throw new Error(`${body?.error ?? 'Request failed'}${details}`)
  }
  return body as T
}

export function getAllAnime() {
  return request<Anime[]>('/api/anime')
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

export function getWatchlist() {
  return request<WatchlistItem[]>('/api/watchlist')
}

export function addToWatchlist(animeId: number) {
  return request<WatchlistItem>('/api/watchlist', {
    method: 'POST',
    body: JSON.stringify({ animeId }),
  })
}

export function removeFromWatchlist(animeId: number) {
  return request<null>(`/api/watchlist/anime/${animeId}`, { method: 'DELETE' })
}
