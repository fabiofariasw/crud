import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://nodep2.ddns.net:3000',
    timeout: 5000,
})

