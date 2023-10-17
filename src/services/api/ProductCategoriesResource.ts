import { AbstractResource } from '@/services/api/AbstractResource'
import { ProductCategory } from '@/services/api/types'

export class ProductCategoriesResource extends AbstractResource<ProductCategory> {
  protected url = '/product-categories'
}
