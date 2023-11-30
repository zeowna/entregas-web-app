import { computed, reactive } from 'vue'
import { io } from 'socket.io-client'
import { store } from '@/store'

export const state = reactive({
  connected: false
})

const URL = import.meta.env.VITE_API_URI

export const socket = io(URL, {
  extraHeaders: {
    authorization: `Bearer ${computed(() => store.getters.getToken)}`
  }
})

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})
