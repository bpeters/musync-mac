import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import app from './app';
import user from './user';
import apple from './apple';
import spotify from './spotify';
import broadcasters from './broadcasters';

const config = {
  version: 1,
  key: 'musync',
  storage,
  blacklist: ['app', 'apple', 'spotify', 'broadcasters'],
  debug: true,
};

const rootReducer = combineReducers({
  app,
  user,
  apple,
  spotify,
  broadcasters,
});

export default persistReducer(config, rootReducer);