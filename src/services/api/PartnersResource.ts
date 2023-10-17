import { AbstractResource } from '@/services/api/AbstractResource';
import { Partner } from '@/services/api/types/Partner';
import { PartnerProduct } from '@/services/api/types';

class PartnerProductsResource extends AbstractResource<PartnerProduct> {
  protected url = '/partners/:id/products'

  async find({}, partnerId: number) {
    return super.find({}, this.url.replace('id', partnerId))
  }
}

export class PartnersResource extends AbstractResource<Partner> {
  protected url = '/partners'


  readonly products = new PartnerProductsResource(this.client)

}
