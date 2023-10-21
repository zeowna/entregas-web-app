import { AbstractResource } from '@/services/api/AbstractResource'
import { ProductCategory } from '@/services/api/types'
import { ProductCategorySizesResource } from '@/services/api/productCategorySizesResource'

export class ProductCategoriesResource extends AbstractResource<ProductCategory> {
  protected url = '/products/categories'

  sizes = new ProductCategorySizesResource(this.client)
}
