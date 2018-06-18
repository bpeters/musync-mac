import React, { Component } from 'react';
import { connect } from 'react-redux';

import './styles.css';

import ApplePlayer from './ApplePlayer';
import SpotifyPlayer from './SpotifyPlayer';
import Broadcasters from './Broadcasters';

import * as userActions from '../actions/user';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.props.initialize();
  }

  componentDidMount() {
    const win = nw.Window.get();

    win.on('loaded', () => {
      this.stopBroadcasting();
    });

    win.on('close', () => {
      win.hide();

      this.stopBroadcasting();

      this.props.close();

      win.close(true);
    });
  }

  stopBroadcasting() {
    this.props.stopSpotifyBroadcasting();
    this.props.stopAppleBroadcasting();
  }

  renderPlayers() {
    if (!this.props.listeningWith) {
      return (
        <div className="App-Players">
          {!this.props.spotifyBroadcasting ? <ApplePlayer /> : null}
          {!this.props.appleBroadcasting ? <SpotifyPlayer /> : null}
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="App">
        {this.renderPlayers()}
        {!this.props.appleBroadcasting && !this.props.spotifyBroadcasting ? <Broadcasters /> : null}
      </div>
    );
  }
}

const bindStore = (state) => {
  return {
    initialized: state.app.initialized,
    spotifyBroadcasting: state.spotify.isBroadcasting,
    appleBroadcasting: state.apple.isBroadcasting,
    broadcasters: state.broadcasters,
    listeningWith: state.app.listeningWith,
  };
};

const bindActions = dispatch => ({
  initialize: () => dispatch(userActions.initialize()),
  close: () => dispatch(userActions.close()),
  stopSpotifyBroadcasting: () => dispatch(userActions.stopSpotifyBroadcasting()),
  stopAppleBroadcasting: () => dispatch(userActions.stopAppleBroadcasting()),
});

export default connect(bindStore, bindActions)(App);
