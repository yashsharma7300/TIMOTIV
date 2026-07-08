import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8000/api'
})

export const login = async (userData) => {

    const response = await API.post("/login", userData)
    return response.data

}

export const signup = async (userData) => {
    const response = await API.post("/signup", userData)
    return response.data
}

export const logout = async () => {
    const response = await API.get("/logout")
    return response.data
}

export const googlelogin = async () => {
    const response = await API.get("/google")
    return response.data
}


