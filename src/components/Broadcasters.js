import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import './styles.css';

import * as userActions from '../actions/user';

class Broadcasters extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.listeningWith) {
      const oldListener = _.find(this.props.broadcasters, { uid: this.props.listeningWith}) || {};
      const newListener = _.find(nextProps.broadcasters, { uid: nextProps.listeningWith}) || {};

      if (
        oldListener.trackId !== newListener.trackId ||
        (oldListener.trackId === newListener.trackId && oldListener.position !== newListener.position)
      ) {
        console.log(newListener);
        this.props.playTrack(newListener);
      }
    }
  }

  renderBroadcasters() {
    return this.props.broadcasters.map((broadcaster) => {
      const listeningWith = this.props.listeningWith === broadcaster.uid;

      let artwork = <div className="Broadcasters-Broadcaster-Art"/>;

      if (broadcaster.artworkUrl) {
        artwork = <img src={broadcaster.artworkUrl} className="Broadcasters-Broadcaster-Art" alt="album art"/>;
      }

      return (
        <div
          key={broadcaster.uid}
          className={`Broadcasters-Broadcaster ListenWith ${listeningWith ? 'ListeningWith' : ''}`}
          onClick={() => {
            if (listeningWith) {
              this.props.listenWith(null);
            } else {
              this.props.listenWith(broadcaster.uid);
            }
          }}
        >
          {artwork}
          <div className="Broadcasters-Broadcaster-Small">
            {broadcaster.uid}
          </div>
          <div className="Broadcasters-Broadcaster-Small">
            {broadcaster.player}
          </div>
          <div className="Broadcasters-Broadcaster-Small">
            {broadcaster.state}
          </div>
          <div className="Broadcasters-Broadcaster-Large">
            {broadcaster.name}
          </div>
          <div className="Broadcasters-Broadcaster-Large">
            {broadcaster.artist}
          </div>
          <div className="Broadcasters-Broadcaster-Mid">
            {broadcaster.album}
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="Broadcasters">
        {this.renderBroadcasters()}
      </div>
    );
  }
}

const bindStore = (state) => {
  return {
    broadcasters: state.broadcasters,
    listeningWith: state.app.listeningWith,
  };
};

const bindActions = dispatch => ({
  listenWith: (uid) => dispatch(userActions.listenWith(uid)),
  playTrack: (broadcaster) => dispatch(userActions.playTrack(broadcaster)),
});

export default connect(bindStore, bindActions)(Broadcasters);
