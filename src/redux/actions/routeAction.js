
import { ROUTE_INIT_ACTION, ROUTE_PUSH_ACTION } from '../constants'

export const initLocation = location => {
    return {
      type: ROUTE_INIT_ACTION,
      payload: location
    }
  }

export const pushLocation = location => {
    return {
      type: ROUTE_PUSH_ACTION,
      payload: location
    }
  }
