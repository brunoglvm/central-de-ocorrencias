export type AdminUser = {
  id: number
  email: string
  image: string | null
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: AdminUser
}

export type UpdateAvatarResponse = {
  image: string | null
}

export type Condominium = {
  image: string | null
}
