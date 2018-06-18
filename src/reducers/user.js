import * as actions from '../constants';

const initialState = {
  uid: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case actions.USER_SET_VALUES: {
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
