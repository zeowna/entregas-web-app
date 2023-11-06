import { AbstractResource } from '@/services/api/AbstractResource'
import { ProductCategorySize } from '@/services/api/types'

export class ProductCategorySizesResource extends AbstractResource<ProductCategorySize> {
  protected url = '/products/categories/:productCategoryId/sizes'

  async findByCategoryId(productCategoryId: number) {
    return super.get<ProductCategorySize[]>(
      this.url.replace(':productCategoryId', `${productCategoryId}`)
    )
  }

  async create(productCategoryId: number, entity: ProductCategorySize) {
    return super.post(this.url.replace(':productCategoryId', `${productCategoryId}`), entity)
  }

  async update(productCategoryId: number, id: number, entity: ProductCategorySize) {
    return super.patch(
      `${this.url.replace(':productCategoryId', `${productCategoryId}`)}/${id}`,
      entity
    )
  }
}
