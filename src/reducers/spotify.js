import * as actions from '../constants';

const initialState = {
  isOpen: false,
  isRunning: false,
  playState: null,
  track: {},
  isBroadcasting: false,
  api: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case actions.SPOTIFY_SET_VALUES: {
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
