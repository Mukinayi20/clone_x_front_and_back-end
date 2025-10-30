import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST') as string,
      port: Number(env.get('SMTP_PORT')), // Assurez-vous que SMTP_PORT est 587 (ou 465)
      secure: false, // À false si le port est 587, à true si le port est 465

      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME') as string,
        pass: env.get('SMTP_PASSWORD') as string,
      },

      tls: {},

      ignoreTLS: false,
      requireTLS: true, // **CORRECTION CLÉ :** Garantit que l'e-mail est envoyé de manière chiffrée

      pool: false,
      maxConnections: 5,
      maxMessages: 100,
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
