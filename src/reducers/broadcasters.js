import _ from 'lodash';
import * as actions from '../constants';

const initialState = [];

export default function user(state = initialState, action) {
  switch (action.type) {
    case actions.BROADCASTERS_SET: {
      return _.map(action.payload, (broadcaster) => {
        const old = _.find(state, { uid: broadcaster.uid });

        return old && !broadcaster.updated ? old : broadcaster;
      });
    }

    default: {
      return state;
    }
  }
}
