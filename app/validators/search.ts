import vine from '@vinejs/vine'

export const searchValidator = vine.compile(
  vine.object({
    q: vine.string().trim().minLength(1),
    e: vine.array(vine.number().withoutDecimals().positive()).optional(),
  })
)
