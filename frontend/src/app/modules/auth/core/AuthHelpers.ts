import Cookies from 'js-cookie'
import {AuthModel} from './_models'

const AUTH_KEY = 'authtoken'
const AUTH_TOKEN = Cookies.get(AUTH_KEY)
const getAuth = (): AuthModel | undefined => {
  if (!AUTH_TOKEN) {
    return
  }

  const lsValue: any = AUTH_TOKEN
  if (!lsValue) {
    return
  }

  try {
    const auth: any = lsValue

    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: any) => {
  // if (!localStorage) {
  //   return
  // }

  try {
    // localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, auth)
    Cookies.set(AUTH_KEY, auth)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (AUTH_TOKEN) {
    return
  }

  try {
    // localStorage.removeItem(AUTH_KEY)
    Cookies.remove(AUTH_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
    (config: {headers: {Authorization: string}}) => {
      const auth = getAuth()
      if (auth) {
        config.headers.Authorization = `Bearer ${auth}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )
}

export {getAuth, setAuth, removeAuth, AUTH_KEY}
