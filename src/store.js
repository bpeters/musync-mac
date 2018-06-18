import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

import reducer from './reducers';

export default function configureStore(initialState) {
  const store = createStore(reducer, compose(applyMiddleware(thunk)));
  const persistor = persistStore(store);

  return { persistor, store };
}