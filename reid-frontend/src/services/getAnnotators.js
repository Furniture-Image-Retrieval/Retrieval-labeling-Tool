import apiService from './apiService'

const getAnnotators = async () => {
  try {
    const { data } = await apiService({
      endpoint: '/user/?role=annotator/',
      method: 'GET',
    })

    if (!data.length) return []

    return data.map(user => ({
      username: user.username,
      role: user.role,
      currentProjects: user.currentProjects,
      doneProjects: user.doneProjects,
    }))
  } catch (error) {
    return (console.error(error), [])
  }
}

export default getAnnotators
