export const centsToCurrency = (value: number) => 'R$ ' + (value / 100).toFixed(2).replace('.', ',')
export const centsToValue = (value: number) => value / 100
