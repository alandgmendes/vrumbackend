import axios from 'axios'

const api = axios.create({
	baseURL: `https://api.mercadopago.com`
})

api.defaults.headers.Authorization = `Bearer ${process.env.ACCESS_TOKEN}`
api.defaults.headers['Content-Type'] = 'application/json'
api.defaults.headers.Accept = '*/*'

export default api