import Cookies from 'js-cookie'
import apiService from './apiService'
import errorMessageToText from '../utils/errorMessageToText'

const login = async ({ username, password }) => {
  try {
    const { data } = await apiService({
      endpoint: '/user/login',
      method: 'POST',
      authTokenNeeded: false,
      data: { username, password },
    })

    Cookies.set('auth_token', data.access_token)
    const result = { succeeded: true }

    return result
  } catch (error) {
    const errorMessage = (error.response.data?.detail?.msg || 'error')

    return (console.error(error), { succeeded: false, errorMessage })
  }
}

export default login
