
export const enum AuthState {
  Authenticated,
  Unauthenticated,
  Pending,
}

export interface Doc {
  user: string,
  body: string,
}