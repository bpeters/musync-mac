import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './index.css';

import App from './components/App';
import configureStore from './store';
import registerServiceWorker from './registerServiceWorker';

const { persistor, store } = configureStore();

const createComponent = (Component) => {
 return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          console.log('We Have Lift Off!');
        }}
      >
        <Component />
      </PersistGate>
    </Provider>
  );
}

const render = Component => ReactDOM.render(createComponent(Component), document.getElementById('root'));

render(App);

if (module.hot) module.hot.accept('./components/App', () => render(App));

registerServiceWorker();
