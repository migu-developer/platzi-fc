'use server'

export type NewsletterState = {
  success: boolean
  message: string
} | null

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = formData.get('email')

  if (!email || typeof email !== 'string') {
    return { success: false, message: 'Por favor, introduce un email valido.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: 'El formato del email no es valido.' }
  }

  try {
    // TODO: Integrate with Resend API
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.contacts.create({
    //   email,
    //   audienceId: process.env.RESEND_AUDIENCE_ID!,
    // })

    // For now, log and return success
    console.log(`[Newsletter] New subscription: ${email}`)

    return {
      success: true,
      message: 'Te has suscrito correctamente. Bienvenido!',
    }
  } catch (error) {
    console.error('[Newsletter] Subscription failed:', error)
    return {
      success: false,
      message: 'Hubo un error al suscribirte. Intentalo de nuevo.',
    }
  }
}
