
import { EXAMPLE_ACTION } from '../constants'

export const exampleAction = text => {
    return {
      type: EXAMPLE_ACTION,
      payload: text
    }
  }