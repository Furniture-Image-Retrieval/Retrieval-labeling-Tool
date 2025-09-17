import apiService from './apiService'

const addUser = async ({ username, password, role }) => {
  try {
    await apiService({
      endpoint: '/user/create',
      method: 'POST',
      data: { username, password, role },
    })

    const result = { succeeded: true }

    return result
  } catch (error) {
    const errorMessage = (error.response.data?.detail?.msg || 'error')

    return (console.error(error), { succeeded: false, errorMessage })
  }
}

export default addUser
