<script setup lang="ts">
const { decimals = 0, min = 0 } = defineProps<{
  decimals?: number
  min?: number
}>()

const amount = defineModel<number>()
const liveValue = ref('')
const lastEmittedValue = ref(0)

// Code from https://github.com/nimiq/vue3-components/blob/8d54857370cffc6c5fdb7b75b12b0e2eacbc8f04/src/components/AmountInput/AmountInput.vue#L96
const formattedValue = computed({
  get() {
    return liveValue.value
  },
  set(value: string) {
    liveValue.value = value
    if (!value) {
      liveValue.value = ''
      lastEmittedValue.value = 0
      amount.value = 0
      // context.emit(AmountInputEvent.MODELVALUE_UPDATE, valueInLuna.value)
      return
    }

    value = value.replace(',', '.')
    const regExp = new RegExp(`^(\\d+)?(\\.(\\d{0,${decimals}})?)?$`)
    const match = value.match(regExp)

    if (match) {
      amount.value = Number.parseFloat(value)
    }
  },
})

function updateFromModel(newValue?: number) {
  if (newValue === undefined || newValue === null)
    return
  const newFormatted = newValue.toFixed(decimals).replace(/\.?0+$/, '')
  if (liveValue.value !== newFormatted) {
    liveValue.value = newFormatted
    lastEmittedValue.value = newValue
  }
}

watch(amount, updateFromModel, { immediate: true })

function onBlur() {
  if ((!amount.value || amount.value === 0) && min > 0) {
    updateFromModel(min)
  }
}
onMounted(() => updateFromModel(amount.value))
</script>

<template>
  <input
    v-model="formattedValue"
    type="text"
    style="field-sizing: content"
    focus-visible:outline="1 solid blue"
    rounded-2
    bg-transparent
    px-6
    font-semibold
    lh-none
    nq-input-box
    inputmode="decimal"
    v-bind="$attrs"
    @blur="onBlur"
  >
</template>
