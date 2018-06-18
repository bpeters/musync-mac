import * as actions from '../constants';

const initialState = {
  isOpen: false,
  isRunning: false,
  playState: null,
  track: {},
  musickit: null,
  isBroadcasting: false,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case actions.APPLE_SET_VALUES: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
}
