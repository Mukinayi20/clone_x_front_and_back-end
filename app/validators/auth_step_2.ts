import vine from '@vinejs/vine'

export const registerUserValidatorstep2 = vine.compile(
  vine.object({
    password: vine.string().minLength(6),
  })
)
