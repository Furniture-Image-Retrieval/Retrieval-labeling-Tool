import apiService from './apiService'

const getQuery = async (project_name, master_id) => {
  try {
    const { data } = await apiService({
      endpoint: `/project/detail/${project_name}/query/${master_id}`,
      method: 'GET',
    })
    return data
  } catch (error) {
    return (console.error(error), [])
  }
}

export default getQuery
