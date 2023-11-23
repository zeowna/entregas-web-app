import { Address, OrderPaymentMethods, OrderStatus } from '@/services/api/types'

export const centsToCurrency = (value: number) =>
  typeof value === 'number' ? 'R$ ' + (value / 100).toFixed(2).replace('.', ',') : 'R$ 0'
export const centsToValue = (value: number) => value / 100

export const formatAddress = (address: Address) =>
  address ? `${address.street}, ${address.number},  ${address.neighbourhood} - ${address.city}` : ''

export const formatAddressSmall = (address: Address) =>
  address ? `${address.street}, ${address.number}` : ''

export const getDistance = (
  { lat: lat1, lng: lng1 }: Address,
  { lat: lat2, lng: lng2 }: Address
) => {
  const radlat1 = (Math.PI * lat1!) / 180
  const radlat2 = (Math.PI * lat2!) / 180
  const theta = lng1! - lng2!
  const radtheta = (Math.PI * theta) / 180
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515

  const km = dist * 1.609344

  return km < 1 ? (km * 1000).toFixed(0) + 'm' : km.toFixed(2) + 'km'
}

export const formatOrderNumber = (number: number) => `${number}`.padStart(4, '0')

export const getOrderStatusColorWeb = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
      return 'info'
    case OrderStatus.CanceledByPartner:
    case OrderStatus.CanceledByCustomer:
    case OrderStatus.RefusedByPartner:
      return 'danger'
    case OrderStatus.AcceptedByPartner:
      return 'warning'
    case OrderStatus.AwaitingExecution:
      return 'warning'
    case OrderStatus.InDelivery:
      return 'info'
    case OrderStatus.Settled:
      return 'success'
    default:
      return ''
  }
}

export const formatOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
      return 'Criado'
    case OrderStatus.CanceledByPartner:
      return 'Cancelado pelo parceiro'
    case OrderStatus.CanceledByCustomer:
      return 'Cancelado pelo cliente'
    case OrderStatus.RefusedByPartner:
      return 'Recusado pelo parceiro'
    case OrderStatus.AcceptedByPartner:
      return 'Aceito pelo parceiro'
    case OrderStatus.AwaitingExecution:
      return 'Aguardando pagamento'
    case OrderStatus.InDelivery:
      return 'Saiu para entrega'
    case OrderStatus.Settled:
      return 'Finalizado'
    default:
      return ''
  }
}

export const formatOrderPaymentMethod = (status: OrderPaymentMethods) => {
  switch (status) {
    case OrderPaymentMethods.DebitCardLocation:
      return 'Débito na entrega'
    case OrderPaymentMethods.CreditCardLocation:
      return 'Crédito na entrega'
    case OrderPaymentMethods.CashLocation:
      return 'Dinheiro na entrega'
    case OrderPaymentMethods.CardRemote:
      return 'Crédito/Debito no App'
    default:
      return ''
  }
}
