import type { UserRole } from '../app/admin/data'

const API_URL = process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'http://localhost:1337'

export interface LoginResponse {
  username: string
  role: UserRole
  id: number
}

export interface LoginError {
  error: string
  message?: string
}

export async function loginUser(
  username: string,
  password: string,
): Promise<LoginResponse | LoginError> {
  try {
    const response = await fetch(`${API_URL}/api/admin-users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.error?.message || 'Invalid credentials',
        message: data.error?.details?.message,
      }
    }

    return data
  } catch (error) {
    console.error('Login error:', error)
    return {
      error: 'Network error. Please check your connection.',
    }
  }
}
