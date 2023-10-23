import { AbstractResource } from '@/services/api/AbstractResource'
import { ProductCategoriesResource } from '@/services/api/ProductCategoriesResource'
import { Product } from '@/services/api/types'

export class ProductResource extends AbstractResource<Product> {
  protected url = '/products'

  categories = new ProductCategoriesResource(this.client)

  async uploadPicture(id: number, base64: string) {
    return this.postMultipart(`${this.url}/${id}/pictures`, base64)
  }
}
