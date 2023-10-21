import { AxiosError, AxiosInstance } from 'axios'
import { BadRequestError, NotFoundError } from './errors'
import { computed, ComputedRef } from 'vue'
import type { Entity, FindEntitiesPaging, FindEntitiesResponse } from './types'
import { store } from '@/store'

export abstract class AbstractResource<T extends Entity> {
  protected abstract url: string

  constructor(protected client: ComputedRef<AxiosInstance>) {}

  async get<R = T>(uri: string, params: any = {}, headers = {}) {
    try {
      const { data } = await this.client.value.get<R>(uri, {
        headers: { ...this.buildAuthorizationHeaders(), ...headers },
        params
      })

      return data
    } catch (err) {
      throw this.handleError(err)
    }
  }

  async post<R = T>(uri: string, body: any, headers = {}) {
    try {
      const { data } = await this.client.value.post<R>(uri, body, {
        headers: { ...this.buildAuthorizationHeaders(), ...headers }
      })

      return data
    } catch (err) {
      throw this.handleError(err)
    }
  }

  async patch<R = T>(uri: string, body: any, headers = {}) {
    try {
      const { data } = await this.client.value.patch<R>(uri, body, {
        headers: { ...this.buildAuthorizationHeaders(), ...headers }
      })

      return data
    } catch (err) {
      throw this.handleError(err)
    }
  }

  async find(
    { conditions = {}, skip = 0, limit = 15, sort = { updatedAt: -1 } }: FindEntitiesPaging = {},
    url = this.url
  ) {
    const response = await this.get<FindEntitiesResponse<T>>(url, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })

    return response
  }

  async findById(id: number) {
    return this.get<T>(`${this.url}/${id}`)
  }

  async create(entity: Entity, url?: string) {
    return this.post<T>(url ?? this.url, entity)
  }

  async update(id: number, entity: Entity, url?: string) {
    return this.patch<T>(url ?? `${this.url}/${id}`, entity)
  }

  private buildAuthorizationHeaders() {
    const token = computed(() => store.getters.getToken)

    return token.value
      ? {
          Authorization: `Bearer ${store.getters.getToken}`
        }
      : {}
  }

  handleError(err: any) {
    if (err && err instanceof AxiosError) {
      const { message, errors } = err?.response?.data ?? {}

      switch (err?.response?.status) {
        case 400:
          return new BadRequestError(errors)
        case 404:
          return new NotFoundError(message)
      }
    }

    return err
  }
}
