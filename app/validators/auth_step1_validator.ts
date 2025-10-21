import vine from '@vinejs/vine'

export const registerUserValidatorstep1 = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2),
    email: vine
      .string()
      .email()
      .unique(async (db, val) => {
        const user = await db.from('users').where('email', val).first()
        return !user
      }),
    // password: vine.string().minLength(8),
  })
)
