import { computed } from 'vue'
import axios from 'axios'
import { AuthResource } from './AuthResource'
import { PartnersResource } from './PartnersResource'
import { OrdersResource } from './OrdersResource'
import { CustomersResource } from './CustomersResource'
import { store } from '@/store'
import { ProductResource } from '@/services/api/ProductResource'

export class Api {
  static client = computed(() => axios.create({ baseURL: store?.getters?.getBaseUrl }))

  static auth = new AuthResource(Api.client)
  static partners = new PartnersResource(Api.client)
  static orders = new OrdersResource(Api.client)
  static customers = new CustomersResource(Api.client)
  static products = new ProductResource(Api.client)
}
