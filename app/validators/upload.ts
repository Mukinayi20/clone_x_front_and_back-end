import vine from '@vinejs/vine'

export const updateValidator = vine.compile(
  vine.object({
    profil: vine.file({
      size: '4mb',
      extnames: ['png', 'jpg', 'jpeg'],
    }),
    couverture: vine.file({
      size: '4mb',
      extnames: ['png', 'jpg', 'jpeg'],
    }),
    fullName: vine.string().trim().minLength(4),
    bio: vine.string().alphaNumeric().maxLength(160),
    location: vine.string().alphaNumeric().maxLength(30),
  })
)
