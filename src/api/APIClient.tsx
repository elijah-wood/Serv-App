import axios from 'axios'

const APIClient = axios.create({
  baseURL: 'https://bloodhound.servcommerce.com/api',
  timeout: 30000,
  errorHandlerEnabled: true,
  headers: { 'Cache-Control': 'no-cache' },
})

export default APIClient
