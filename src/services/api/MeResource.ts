import { AbstractResource } from '@/services/api/AbstractResource'
import { User } from '@/services/api/types'

export class MeResource extends AbstractResource<User> {
  protected url = '/me'

  async findMe() {
    return this.get(this.url)
  }

  async update(entity: User) {
    return super.patch(this.url, { ...entity, password: undefined })
  }

  async updateMyPassword(password: string) {
    return super.patch(`${this.url}/password`, { password })
  }

  async uploadProfilePicture(file: File) {
    return this.postMultipart(`${this.url}/pictures`, file)
  }
}
