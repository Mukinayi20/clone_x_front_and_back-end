import vine from '@vinejs/vine'

export const registerValidatorstep1 = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2),
    email: vine
      .string()
      .email()
      .unique(async (db, val) => {
        const email = await db.from('users').where('email', val).first()
        return !email
      }),
    day: vine.number().min(1).max(31),
    month: vine.number().min(1).max(12),
    year: vine.number().min(1900).max(new Date().getFullYear()),
    //password: vine.string().minLength(8),
  })
)

export const registerValidatorstep2 = vine.compile(
  vine.object({
    password: vine.string().minLength(6),
    confirmpassword: vine.string().minLength(6).sameAs('password'),
  })
)

export const loginValidatorstep1 = vine.compile(
  vine.object({
    email: vine.string().email().minLength(3),
  })
)

export const loginValidatorstep2 = vine.compile(
  vine.object({
    password: vine.string().minLength(6),
  })
)
