import apiService from './apiService'

const getUserInfo = async () => {
  try {
    const { data } = await apiService({
      endpoint: '/user/me',
      method: 'POST',
    })

    if (!data) return {}

    return {
      username: data.username,
      role: data.role,
    }
  } catch (error) {
    return (console.error(error), {})
  }
}

export default getUserInfo
