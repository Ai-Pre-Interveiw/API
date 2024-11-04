import axios from 'axios'

export const BASE_URL = 'http://localhost:8000'
// export const BASE_URL = 'https://giveus.site'

export const publicRequest = axios.create({
  baseURL: BASE_URL,
})

export const authRequest = axios.create({
  baseURL: BASE_URL,
})