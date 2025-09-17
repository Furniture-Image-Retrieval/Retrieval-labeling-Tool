import Cookies from 'js-cookie'

export const authState = 'loggedIn'

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return 'loggedIn'
    case 'logout':
      return 'loggedOut'
    case 'loading':
      return 'loading'
    default:
      throw new Error()
  }
}

export const userInfoState = {}

export const userInfoReducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return action.payload
    case 'clear':
      return {}
  }
}
