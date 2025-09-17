import apiService from './apiService'

const getProject = async (name) => {
  try {
    const { data } = await apiService({
      endpoint: `/project/${name}`,
      method: 'GET',
    })
    return data
  } catch (error) {
    return (console.error(error), [])
  }
}

export default getProject
