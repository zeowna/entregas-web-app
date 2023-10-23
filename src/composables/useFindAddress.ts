import { Api } from '@/services/api/Api'

export const useFindAddress = () => {
  const findAddressByCep = async (cep: string) => {
    if (cep.replace(/[^a-zA-Z0-9 ]/g, '').length < 8) {
      return
    }

    return Api.addresses.findByCep(cep)
  }

  return {
    findAddressByCep
  }
}
