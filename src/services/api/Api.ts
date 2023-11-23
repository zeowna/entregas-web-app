import { computed } from 'vue'
import axios from 'axios'
import { AuthResource } from './AuthResource'
import { PartnersResource } from './PartnersResource'
import { CustomersResource } from './CustomersResource'
import { store } from '@/store'
import { ProductsResource } from '@/services/api/ProductsResource'
import { AddressesResource } from '@/services/api/AddressesResource'
import { AdminResource } from '@/services/api/types/AdminResource'
import { MeResource } from '@/services/api/MeResource'

export class Api {
  static client = computed(() => axios.create({ baseURL: store?.getters?.getBaseUrl }))

  static auth = new AuthResource(Api.client)
  static me = new MeResource(Api.client)
  static addresses = new AddressesResource(Api.client)
  static partners = new PartnersResource(Api.client)
  static customers = new CustomersResource(Api.client)
  static products = new ProductsResource(Api.client)
  static admin = new AdminResource(Api.client)
}
