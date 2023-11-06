import { AbstractResource } from '@/services/api/AbstractResource'
import { PartnerProduct } from '@/services/api/types'

export class PartnerProductsResource extends AbstractResource<PartnerProduct> {
  protected url = '/partners/:id/products'
}
