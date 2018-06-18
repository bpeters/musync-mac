import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import './styles.css';

import * as userActions from '../actions/user';

let musicInterval;

class SpotifyPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    musicInterval = setInterval(() => {
      this.props.listenToSpotify();
    }, 1000);
  }

  componentDidMount() {
    this.props.setSpotifyAPI();
  }

  componentWillUnmount() {
    if (musicInterval) {
      clearInterval(musicInterval);
    }

    if (this.props.isBroadcasting) {
      this.props.toggleSpotifyBroadcasting();
    }
  }

  renderBroadcast() {
    if (!_.isEmpty(this.props.track) && !this.props.appleBroadcasting) {
      return (
        <button
          className="Spotify-Broadcast"
          onClick={() => {
            if (this.props.isBroadcasting) {
              this.props.stopBroadcasting();
            } else {
              this.props.startBroadcasting();
            }
          }}
        >
          {this.props.isBroadcasting ? 'Stop Broadcasting' : 'Start Broadcasting'}
        </button>
      );
    }

    return null;
  }

  renderTrack() {
    const track = this.props.track;

    if (!_.isEmpty(track)) {
      return (
        <div className="Spotify-Track">
          <div className="Spotify-Track-Name">
            {track.name}
          </div>
          <div className="Spotify-Track-Artist">
            {track.artist}
          </div>
          <div className="Spotify-Track-Album">
            {track.album}
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    let status;

    if (this.props.isOpen) {
      if (this.props.isRunning) {
        status = `is currently ${this.props.playState}`;
      } else {
        status = 'is having issues';
      }
    } else {
      status = 'Open Spotify desktop app';
    }

    return (
      <div className="Spotify">
        <div className="Spotify-Title">
          Spotify
        </div>
        <div className="Spotify-Status">
          {status}
        </div>
        {this.renderTrack()}
        {this.renderBroadcast()}
      </div>
    );
  }
}

const bindStore = (state) => {
  return {
    ...state.spotify,
    appleBroadcasting: state.apple.isBroadcasting,
  };
};

const bindActions = dispatch => ({
  setSpotifyAPI: () => dispatch(userActions.setSpotifyAPI()),
  listenToSpotify: () => dispatch(userActions.listenToSpotify()),
  startBroadcasting: () => dispatch(userActions.startSpotifyBroadcasting()),
  stopBroadcasting: () => dispatch(userActions.stopSpotifyBroadcasting()),
});

export default connect(bindStore, bindActions)(SpotifyPlayer);
