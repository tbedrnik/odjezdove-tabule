import vine from '@vinejs/vine'

export const updateBoardValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    boardStations: vine
      .array(
        vine.object({
          id: vine.number().withoutDecimals().positive().optional(),
          showDepartures: vine.boolean(),
          minutesToWalk: vine.number().withoutDecimals().min(0).max(120).nullable(),
          stationId: vine.number().withoutDecimals().positive(),
        })
      )
      .minLength(1)
      .maxLength(10),
  })
)
