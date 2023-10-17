import { computed } from 'vue'
import axios from 'axios'
import { AuthResource } from './AuthResource'
import { PartnersResource } from './PartnersResource'
import { OrdersResource } from './OrdersResource'
import { CustomersResource } from './CustomersResource'
import { store } from '@/store'
import { ProductCategoriesResource } from '@/services/api/ProductCategoriesResource'

export class Api {
  static client = computed(() => axios.create({ baseURL: store?.getters?.getBaseUrl }))

  static auth = new AuthResource(Api.client)
  static partners = new PartnersResource(Api.client)
  static orders = new OrdersResource(Api.client)
  static customers = new CustomersResource(Api.client)
  static productCategories = new ProductCategoriesResource(Api.client)
}
