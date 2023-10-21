import { AbstractResource } from '@/services/api/AbstractResource'
import { ProductCategorySize } from '@/services/api/types'

export class ProductCategorySizesResource extends AbstractResource<ProductCategorySize> {
  protected url = '/products/categories/:productCategoryId/sizes'

  async findByCategoryId(productCategoryId: number) {
    return super.get<ProductCategorySize[]>(
      this.url.replace(':productCategoryId', `${productCategoryId}`)
    )
  }

  async create(entity: ProductCategorySize) {
    return super.create(entity, this.url.replace(':productCategoryId', `${entity.categoryId}`))
  }

  async update(id: number, entity: ProductCategorySize) {
    return super.update(
      id,
      entity,
      `${this.url.replace(':productCategoryId', `${entity.categoryId}`)}/${id}`
    )
  }
}
