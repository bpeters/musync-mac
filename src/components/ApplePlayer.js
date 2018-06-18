import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import './styles.css';

import * as userActions from '../actions/user';

let musicInterval;

class ApplePlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    musicInterval = setInterval(() => {
      this.props.listenToApple();
    }, 1000);
  }

  componentDidMount() {
    document.addEventListener('musickit', async () => {
      window.MusicKit.configure({
        developerToken: process.env.REACT_APP_MUSICKIT_TOKEN,
        app: {
          name: 'MuSync',
          build: 1,
          icon: `${process.env.PUBLIC_URL}/logo.png`,
        },
      });

      const musickit = window.MusicKit.getInstance();

      this.props.setMusicKit(musickit);
    });
  }

  componentWillUnmount() {
    if (musicInterval) {
      clearInterval(musicInterval);
    }
  }

  renderBroadcast() {
    if (!_.isEmpty(this.props.track) && !this.props.spotifyBroadcasting && _.get(this.props.musickit, 'isAuthorized')) {
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

    if (!_.isEmpty(track) && _.get(this.props.musickit, 'isAuthorized')) {
      return (
        <div className="Apple-Track">
          <div className="Apple-Track-Name">
            {track.name}
          </div>
          <div className="Apple-Track-Artist">
            {track.artist}
          </div>
          <div className="Apple-Track-Album">
            {track.album}
          </div>
        </div>
      );
    }

    return null;
  }

  renderAuthorize() {
    if (this.props.musickit) {
      if (this.props.musickit.isAuthorized) {
        return (
          <button
            className="Apple-Authorize"
            onClick={() => {
              this.props.musickit.unauthorize();
            }}
          >
            Unauthorize
          </button>
        );
      } else if (!this.props.musickit.isAuthorized) {
        return (
          <button
            className="Apple-Authorize"
            onClick={() => {
              this.props.musickit.authorize();
            }}
          >
            Authorize
          </button>
        );
      }
    }

    return null;
  }

  render() {
    let status;

    if (!_.get(this.props.musickit, 'isAuthorized')) {
      status = 'Needs authorization'
    } else if (this.props.isOpen) {
      if (this.props.isRunning) {
        status = `is currently ${this.props.playState}`;
      } else {
        status = 'is having issues';
      }
    } else {
      status = 'Open iTunes desktop app';
    }

    return (
      <div className="Apple">
        <div className="Apple-Title">
          Apple Music
        </div>
        <div className="Apple-Status">
          {status}
        </div>
        {this.renderTrack()}
        {this.renderBroadcast()}
        {this.renderAuthorize()}
      </div>
    );
  }
}

const bindStore = (state) => {
  return {
    ...state.apple,
    spotifyBroadcasting: state.spotify.isBroadcasting,
  };
};

const bindActions = dispatch => ({
  listenToApple: () => dispatch(userActions.listenToApple()),
  setMusicKit: (musickit) => dispatch(userActions.setMusicKit(musickit)),
  startBroadcasting: () => dispatch(userActions.startAppleBroadcasting()),
  stopBroadcasting: () => dispatch(userActions.stopAppleBroadcasting()),
});

export default connect(bindStore, bindActions)(ApplePlayer);
