
import {
  ROUTE_SET_AUTHENTICATED,
  ROUTE_INIT_ACTION,
  ROUTE_PUSH_ACTION
} from '../constants'

// indicate to the Router whether or not the
// current user has been authenticated. a proper
// user authentication token will need to be stored
// independently of the router and used with REST requests
// authentication only disables or enables the rendering of
// certain ROUTE_SET_AUTHENTICATED

export const setAuthenticated = authenticated => {
    return {
      type: ROUTE_SET_AUTHENTICATED,
      payload: authenticated
    }
  }


// set the current location, without effecting browser history

export const initLocation = location => {
    return {
      type: ROUTE_INIT_ACTION,
      payload: location
    }
  }

// push a location
// for a web platform, push onto the browser history as well
// for a mobile platform, push onto the mobile history
// to support the use of the back button

export const pushLocation = location => {
    return {
      type: ROUTE_PUSH_ACTION,
      payload: location
    }
  }
