import { AbstractResource } from '@/services/api/AbstractResource'
import { FindEntitiesPaging, FindEntitiesResponse, ProductCategorySize } from '@/services/api/types'

export class ProductCategorySizesResource extends AbstractResource<ProductCategorySize> {
  protected url = '/products'

  async find(
    productCategoryId: number,
    { conditions = {}, skip = 0, limit = 15, sort = { updatedAt: -1 } }: FindEntitiesPaging = {}
  ) {
    return this.get<FindEntitiesResponse<ProductCategorySize>>(
      `${this.url}/categories/${productCategoryId}/sizes`,
      {
        conditions: JSON.stringify(conditions),
        skip,
        limit,
        sort: JSON.stringify(sort)
      }
    )
  }

  async create(productCategoryId: number, entity: ProductCategorySize) {
    return super.post(`${this.url}/categories/${productCategoryId}/sizes`, entity)
  }

  async update(productCategoryId: number, id: number, entity: ProductCategorySize) {
    return super.patch(`${this.url}/categories/${productCategoryId}/sizes/${id}`, entity)
  }
}
