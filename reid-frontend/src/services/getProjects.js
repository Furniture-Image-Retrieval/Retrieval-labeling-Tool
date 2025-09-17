import apiService from './apiService'

const getProjects = async () => {
  try {
    const { data } = await apiService({
      endpoint: '/project/all',
      method: 'GET',
    })

    if (!data.length) return []

    return data.map(project => ({
      id: project.name,
      name: project.name,
      status: project.status,
      query_ids: project.query_ids,
      annotator: project.annotator,
      reviewer: project.reviewer,
    }))
  } catch (error) {
    return (console.error(error), [])
  }
}

export default getProjects
