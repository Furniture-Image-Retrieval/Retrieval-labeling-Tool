import apiService from './apiService'

const getUsers = async () => {
  try {
    const { data } = await apiService({
      endpoint: '/user/',
      method: 'GET',
    })

    if (!data.length) return []

    return data.map((user, index) => ({
      username: user.username,
      id: index,
      role: user.role,
      currentProjects: user.currentProjects,
      doneProjects: user.num_active_projects,
    }))
  } catch (error) {
    return (console.error(error), [])
  }
}

export default getUsers
