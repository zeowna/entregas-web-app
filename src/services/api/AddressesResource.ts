import { AbstractResource } from '@/services/api/AbstractResource'
import { Address } from '@/services/api/types'

export class AddressesResource extends AbstractResource<Address> {
  protected url = '/addresses'

  async findByCep(cep: string) {
    return this.get<Address>(`${this.url}/cep/${cep}`)
  }
}
