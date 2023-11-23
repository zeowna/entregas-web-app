import { AxiosError, AxiosInstance } from 'axios'
import { BadRequestError, NotFoundError } from './errors'
import { computed, ComputedRef } from 'vue'
import type { Entity } from './types'
import { store } from '@/store'

export abstract class AbstractResource<T extends Entity> {
  protected abstract url: string

  constructor(protected client: ComputedRef<AxiosInstance>) {
  }

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

  async delete<R = T>(uri: string, headers = {}) {
    try {
      const { data } = await this.client.value.delete<R>(uri, {
        headers: { ...this.buildAuthorizationHeaders(), ...headers }
      })

      return data
    } catch (err) {
      throw this.handleError(err)
    }
  }

  async postMultipart<R = T>(uri: string, file: File, headers = {}) {
    const { data } = await this.client.value.postForm<R>(
      uri,
      {
        file: file
      },
      {
        headers: {
          ...this.buildAuthorizationHeaders(),
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return data
  }

  private buildAuthorizationHeaders() {
    const token = computed(() => store.getters.getToken)

    return token.value
      ? {
        lang: 'pt-BR',
        Authorization: `Bearer ${token.value}`
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
        default:
          return new Error(err?.response?.data?.message)
      }
    }

    return err
  }


}
