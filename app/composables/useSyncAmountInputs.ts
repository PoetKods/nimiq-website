import { FiatCurrency } from '@nimiq/utils/fiat-api'

export function useSyncAmountInputs() {
  const { price } = useNimPrice()

  const fiatCurrency = ref(FiatCurrency.USD)
  const cryptoCurrency = ref('NIM')
  const cryptoAmount = ref(1)
  const fiatAmount = ref(cryptoAmount.value * price.value)

  let isSyncing = false

  watch(
    cryptoAmount,
    (val) => {
      if (isSyncing)
        return
      isSyncing = true
      fiatAmount.value = val * price.value
      isSyncing = false
    },
    { flush: 'post' },
  )

  watch(
    fiatAmount,
    (val) => {
      if (isSyncing)
        return
      isSyncing = true
      cryptoAmount.value = val / price.value
      isSyncing = false
    },
    { flush: 'post' },
  )

  return { fiatAmount, cryptoAmount, fiatCurrency, cryptoCurrency }
}
