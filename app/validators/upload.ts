import vine from '@vinejs/vine'

export const updateValidator = vine.compile(
  vine.object({
    profil: vine
      .file({
        size: '4mb',
        extnames: ['png', 'jpg', 'jpeg'],
      })
      .optional(),
    couverture: vine
      .file({
        size: '4mb',
        extnames: ['png', 'jpg', 'jpeg'],
      })
      .optional(),
    fullname: vine.string().trim().minLength(4),
    bio: vine.string().maxLength(160).optional(),
    location: vine.string().optional(),
  })
)

export const resetPasswordValidatorstep1 = vine.compile(
  vine.object({
    password: vine.string().minLength(6),
    confirmationPassword: vine.string().minLength(6),
  })
)
