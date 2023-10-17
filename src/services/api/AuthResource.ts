import { AbstractResource } from '@/services/api/AbstractResource'
import type { AuthResponse } from '@/services/api/types'

export class AuthResource extends AbstractResource<AuthResponse> {
  protected url = '/auth'

  async signIn(email: string, password: string) {
    const response = await super.post(this.url, { email, password })

    return response
  }

  async forgotPassword(email: string) {
    const url = 'forgot-password'

    return super.post(`${this.url}/${url}`, { email })
  }

  async refreshToken(token: string) {
    const url = 'refresh-token'

    return super.post(`${this.url}/${url}`, {})
  }
}
