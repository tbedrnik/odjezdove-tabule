import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(4),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8),
    confirmPassword: vine.string().sameAs('password'),
  })
)
