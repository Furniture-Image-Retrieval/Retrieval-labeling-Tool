import apiService from './apiService'

const removeUser = async (username) => {
  try {
    const data = await apiService({
      endpoint: `/user/delete`,
      method: 'DELETE',
      data: { username },
    })

    if (!data) return { succeeded: false }

    const result = { ...data, succeeded: true }

    return result
  } catch (error) {
    const errorMessage = (error.response.data?.detail?.msg || 'error')

    return (console.error(error), { succeeded: false, errorMessage })
  }
}

export default removeUser
