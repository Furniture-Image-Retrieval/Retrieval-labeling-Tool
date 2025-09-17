import apiService from './apiService'
/**
 * 
 DEPRICATED
 */
const updateProject = async (data) => {
  try {
    await apiService({
      endpoint: '/project/detail',
      method: 'POST',
      data,
    })

    const result = { succeeded: true }

    return result
  } catch (error) {
    const errorMessage = (error.response.data?.detail?.msg || 'error')

    return (console.error(error), { succeeded: false, errorMessage })
  }
}

export default updateProject
