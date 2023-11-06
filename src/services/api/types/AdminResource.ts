import { AbstractResource } from '@/services/api/AbstractResource'
import { AdminUsersResource } from '@/services/api/types/AdminUsersResource'

export class AdminResource extends AbstractResource<any> {
  protected url = '/admin'

  readonly users = new AdminUsersResource(this.client)
}
