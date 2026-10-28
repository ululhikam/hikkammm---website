const LOCAL_KEY = 'hikkammm.admin.token'
const SESSION_KEY = 'hikkammm.admin.token.session'

export function getAdminToken(): string | null {
  return localStorage.getItem(LOCAL_KEY) ?? sessionStorage.getItem(SESSION_KEY)
}

export function saveAdminToken(token: string, remember: boolean): void {
  clearAdminToken()

  if (remember) {
    localStorage.setItem(LOCAL_KEY, token)
  } else {
    sessionStorage.setItem(SESSION_KEY, token)
  }
}

export function clearAdminToken(): void {
  localStorage.removeItem(LOCAL_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken())
}