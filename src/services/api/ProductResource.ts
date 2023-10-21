import { AbstractResource } from '@/services/api/AbstractResource'
import { ProductCategoriesResource } from '@/services/api/ProductCategoriesResource'
import { Product } from '@/services/api/types'

export class ProductResource extends AbstractResource<Product> {
  protected url = '/products'

  categories = new ProductCategoriesResource(this.client)
}
