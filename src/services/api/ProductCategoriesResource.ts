import { AbstractResource } from '@/services/api/AbstractResource'
import { FindEntitiesPaging, FindEntitiesResponse, ProductCategory } from '@/services/api/types'
import { ProductCategorySizesResource } from '@/services/api/productCategorySizesResource'

export class ProductCategoriesResource extends AbstractResource<ProductCategory> {
  protected url = '/products/categories'

  sizes = new ProductCategorySizesResource(this.client)

  async find({
    conditions = {},
    skip = 0,
    limit = 15,
    sort = { updatedAt: -1 }
  }: FindEntitiesPaging = {}) {
    return this.get<FindEntitiesResponse<ProductCategory>>(this.url, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })
  }

  async findById(id: number) {
    return super.get(`${this.url}/${id}`)
  }

  async create(entity: ProductCategory) {
    return this.post(this.url, entity)
  }

  async update(id: number, entity: ProductCategory) {
    return this.patch(`${this.url}/${id}`, entity)
  }
}
