import vine from '@vinejs/vine'

// Validation register step1

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

// Validation register step2

export const registerValidatorstep2 = vine.compile(
  vine.object({
    password: vine.string().minLength(6),
    confirmpassword: vine.string().minLength(6).sameAs('password'),
  })
)

// Validation login step1

export const loginValidatorstep1 = vine.compile(
  vine.object({
    email: vine.string().email().minLength(3),
  })
)

// Validation login step2

export const loginValidatorstep2 = vine.compile(
  vine.object({
    password: vine.string().minLength(6),
  })
)
