import apiService from './apiService'

const updateQuerySelectedItems = async (project_name, master_id, selected_items, self_reid=false) => {
  try {
    const data = {
        "selected_items": selected_items,
        "is_done": true,
        "self_reid": self_reid
    }
    await apiService({
      endpoint: `/project/detail/${project_name}/query/${master_id}`,
      method: 'POST',
      data,
    })

    const result = { succeeded: true }

    return result
  } catch (error) {
    const errorMessage = ('error')

    return (console.error(error), { succeeded: false, errorMessage })
  }
}

export default updateQuerySelectedItems
