import * as actions from '../constants';

const initialState = {
  initialized: false,
  loading: false,
  error: null,
  listener: null,
  listeningWith: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case actions.APP_SET_VALUES: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case actions.APP_RESET: {
      if (state.listener) {
        state.listener();
      }

      return initialState;
    }

    default: {
      return state;
    }
  }
}
