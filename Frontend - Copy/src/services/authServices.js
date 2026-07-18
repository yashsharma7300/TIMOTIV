import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8000/api',

    withCredentials: true,

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
    const response = await API.post("/logout")
    return response.data
}

export const googleLogin = async (credential) => {
    const response = await API.post("/google", { credential })
    return response.data
}


