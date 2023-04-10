import axios from 'axios'

const APIClient = axios.create({
  baseURL: 'https://serv-40te.onrender.com/api/',
  timeout: 30000,
  errorHandlerEnabled: true,
  headers: { 'Cache-Control': 'no-cache' },
})

export default APIClient
