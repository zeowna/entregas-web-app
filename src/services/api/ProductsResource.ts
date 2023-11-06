import { AbstractResource } from '@/services/api/AbstractResource'
import { ProductCategoriesResource } from '@/services/api/ProductCategoriesResource'
import { FindEntitiesPaging, FindEntitiesResponse, Product } from '@/services/api/types'

export class ProductsResource extends AbstractResource<Product> {
  protected url = '/products'

  categories = new ProductCategoriesResource(this.client)

  async find({
    conditions = {},
    skip = 0,
    limit = 15,
    sort = { updatedAt: -1 }
  }: FindEntitiesPaging = {}) {
    return this.get<FindEntitiesResponse<Product>>(this.url, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })
  }

  async findById(id: number) {
    return super.get(`${this.url}/${id}`)
  }

  async create(entity: Product) {
    return this.post(this.url, entity)
  }

  async update(id: number, entity: Product) {
    return this.patch(`${this.url}/${id}`, entity)
  }

  async uploadPicture(id: number, file: File) {
    return this.postMultipart(`${this.url}/${id}/pictures`, file)
  }
}
