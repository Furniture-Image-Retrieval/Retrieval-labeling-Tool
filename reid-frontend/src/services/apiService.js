import axios from 'axios'
import Cookies from 'js-cookie'

// const baseUrl = "http://172.17.8.38:8002"
// const baseUrl = "http://172.17.13.44:8002"
const baseUrl = "http://127.0.0.1:8000"


const apiService = ({ endpoint, url, method, data, authTokenNeeded = true, isMultiPartData, headers = {}, onUploadProgress = null, responseType }) => {
  const options = {
    method,
    url: encodeURI(url || `${baseUrl}${endpoint}`),
    data,
    headers: {
      ...headers,
      ...(authTokenNeeded && { Token: `${Cookies.get('auth_token')}` }),
      ...(isMultiPartData && { 'Content-Type': 'multipart/form-data' }),
    },
    onUploadProgress,
    responseType,
  }

  const responsePromise = axios(options)

  responsePromise.catch(error => {
    console.log(error)
    // if (error.response?.status === 500) {
    //   Cookies.remove('auth_token')
    //   window.location.replace('login')
    // }

    // you can handler 401 or 403 here
  })

  return responsePromise
}

export default apiService
