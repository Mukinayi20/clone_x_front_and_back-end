import vine from '@vinejs/vine'

export const storePostValidator = vine.compile(
  vine.object({
    slugImg: vine
      .file({
        size: '4mb',
        extnames: ['png', 'jpg', 'jpeg'],
      })
      .optional(),
    content: vine.string().optional(),
  })
)

export const updatePostValidator = vine.compile(
  vine.object({
    slugImg: vine
      .file({
        size: '4mb',
        extnames: ['png', 'jpg', 'jpeg'],
      })
      .optional(),
    content: vine.string().optional(),
  })
)
