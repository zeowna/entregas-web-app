import { reactive } from 'vue'
import { io } from 'socket.io-client'

export const state = reactive({
  connected: false
})

const URL = import.meta.env.VITE_API_URI

export const socket = io(URL, { autoConnect: false })

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})
