import _ from 'lodash';
import moment from 'moment';
import { machineIdSync } from 'node-machine-id';

import * as actions from '../constants';
import * as spotify from '../core/spotify';
import * as apple from '../core/apple';
import * as firebase from '../core/firebase';

const SpotifyWebApi = require('spotify-web-api-node');

let broadcastUpdating = false;

const formatTrack = async (track, player, musickit, spotifyApi, trackChange, trackSeek, stateChange) => {
  const appleResult = await musickit.api.search(`${track.name} ${track.artist} ${track.album}`, {
    limit: 1,
    types: 'songs,artists,albums'
  });

  const appleSong = _.head(appleResult.songs.data) || {};

  const spotifyResult = await spotifyApi.searchTracks(`track:${track.name} artist:${track.artist} album:${track.album}`);

  const spotifySong = _.head(spotifyResult.body.tracks.items) || {};

  return {
    ...track,
    player,
    trackId: player === 'spotify' ? track.trackId : appleSong.id,
    appleId: appleSong.id || '',
    spotifyId: spotifySong.uri || '',
    artworkUrl: spotifySong.album ? _.get(spotifySong.album, 'images[0].url', '') : '',
    trackChange,
    trackSeek,
    stateChange,
  };
};

export const initialize = () => async (dispatch, getState) => {
  try {
    const state = getState();

    let uid = state.user.uid || machineIdSync({original: true})

    dispatch({
      type: actions.USER_SET_VALUES,
      payload: {
        uid,
      },
    });

    const listener = await firebase.getBroadcasters(uid, dispatch);

    dispatch({
      type: actions.APP_SET_VALUES,
      payload: {
        initialized: true,
        listener,
      },
    });
  } catch (error) {
    console.log('Listen To Spotify Error', error);
  }
};

export const close = () => async (dispatch) => {
  dispatch({
    type: actions.APP_RESET,
  });
};

export const setMusicKit = (musickit) => async (dispatch) => {
  dispatch({
    type: actions.APPLE_SET_VALUES,
    payload: {
      musickit,
    },
  });
};

export const setSpotifyAPI = () => async (dispatch) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT,
    clientSecret: process.env.REACT_APP_SPOTIFY_SECRET,
  });

  const result = await spotifyApi.clientCredentialsGrant();

  spotifyApi.setAccessToken(result.body['access_token']);

  dispatch({
    type: actions.SPOTIFY_SET_VALUES,
    payload: {
      api: spotifyApi,
    },
  });
};

export const startSpotifyBroadcasting = () => async (dispatch, getState) => {
  try {
    const state = getState();

    dispatch({
      type: actions.SPOTIFY_SET_VALUES,
      payload: {
        isBroadcasting: true,
      },
    });

    const formattedTrack = await formatTrack(state.spotify.track, 'spotify', state.apple.musickit, state.spotify.api, true, false, false);
    await firebase.broadcast(state.user.uid, formattedTrack);
  } catch (error) {
    console.log('Start Spotify Broadcasting', error);
  }
};

export const stopSpotifyBroadcasting = () => async (dispatch, getState) => {
  try {
    const state = getState();

    dispatch({
      type: actions.SPOTIFY_SET_VALUES,
      payload: {
        isBroadcasting: false,
      },
    });

    await firebase.stopBroadcasting(state.user.uid);
  } catch (error) {
    console.log('Stop Spotify Broadcasting', error);
  }
};

export const startAppleBroadcasting = () => async (dispatch, getState) => {
  try {
    const state = getState();

    dispatch({
      type: actions.APPLE_SET_VALUES,
      payload: {
        isBroadcasting: true,
      },
    });

    const formattedTrack = await formatTrack(state.apple.track, 'apple', state.apple.musickit, state.spotify.api, true, false, false);
    await firebase.broadcast(state.user.uid, formattedTrack);
  } catch (error) {
    console.log('Start Spotify Broadcasting', error);
  }
};

export const stopAppleBroadcasting = () => async (dispatch, getState) => {
  try {
    const state = getState();

    dispatch({
      type: actions.APPLE_SET_VALUES,
      payload: {
        isBroadcasting: false,
      },
    });

    await firebase.stopBroadcasting(state.user.uid);
  } catch (error) {
    console.log('Stop Spotify Broadcasting', error);
  }
};

export const listenToSpotify = () => async (dispatch, getState) => {
  try {
    const state = getState();

    let isOpen = await spotify.isOpen();
    let isRunning = state.spotify.isRunning;
    let playState = state.spotify.playState;
    let track = state.spotify.track;

    if (isOpen) {
      isRunning = await spotify.isRunning();
      playState = await spotify.getState();

      if (isRunning && playState !== 'stopped') {
        const newTrack = await spotify.getTrack();

        const trackChange = newTrack.trackId !== track.trackId;
        const trackSeek = newTrack.trackId === track.trackId && (newTrack.position > track.position + 3 || newTrack.position < track.position - 3);
        const stateChange = newTrack.state !== track.state;

        if (trackChange || trackSeek || stateChange) {
          if (state.spotify.isBroadcasting && !broadcastUpdating) {
            broadcastUpdating = true;

            const formattedTrack = await formatTrack(newTrack, 'spotify', state.apple.musickit, state.spotify.api, trackChange, trackSeek, stateChange);
            await firebase.broadcast(state.user.uid, formattedTrack);

            setTimeout(() => {
              broadcastUpdating = false;
            }, 3000);
          }
        }

        track = newTrack;
      }
    }

    dispatch({
      type: actions.SPOTIFY_SET_VALUES,
      payload: {
        isOpen,
        isRunning,
        playState,
        track,
      },
    });
  } catch (error) {
    console.log('Listen To Spotify Error', error);
  }
};

export const listenToApple = () => async (dispatch, getState) => {
  try {
    const state = getState();

    let isOpen = await apple.isOpen();
    let isRunning = state.apple.isRunning;
    let playState = state.apple.playState;
    let track = state.apple.track;

    if (isOpen) {
      isRunning = await apple.isRunning();
      playState = await apple.getState();

      if (isRunning && playState !== 'stopped') {
        const newTrack = await apple.getTrack();

        const trackChange = newTrack.trackId !== track.trackId;
        const trackSeek = newTrack.trackId === track.trackId && (newTrack.position > track.position + 3 || newTrack.position < track.position - 3);
        const stateChange = newTrack.state !== track.state;

        if (trackChange || trackSeek || stateChange) {
          if (state.apple.isBroadcasting && !broadcastUpdating) {
            broadcastUpdating = true;

            const formattedTrack = await formatTrack(newTrack, 'apple', state.apple.musickit, state.spotify.api, trackChange, trackSeek, stateChange);
            await firebase.broadcast(state.user.uid, formattedTrack);

            setTimeout(() => {
              broadcastUpdating = false;
            }, 3000);
          }
        }

        track = newTrack;
      }
    }

    dispatch({
      type: actions.APPLE_SET_VALUES,
      payload: {
        isOpen,
        isRunning,
        playState,
        track,
      },
    });
  } catch (error) {
    console.log('Listen To Apple Error', error);
  }
};

export const listenWith = (uid) => async (dispatch, getState) => {
  dispatch({
    type: actions.APP_SET_VALUES,
    payload: {
      listeningWith: uid,
    },
  });
};

const handleSpotifyPlayback = async (broadcaster) => {
  if (broadcaster.trackChange) {
    await spotify.playTrack(broadcaster.spotifyId);

    const updatedPosition = moment().format('X') - broadcaster.updated.seconds;

    if (updatedPosition > 3) {
      await spotify.jumpTo(updatedPosition);
    }
  } else if (broadcaster.trackSeek) {
    await spotify.jumpTo(broadcaster.position);
  }
};

const handleApplePlayback = async (musickit, broadcaster) => {
  if (broadcaster.trackChange) {
    await musickit.setQueue({ song: broadcaster.appleId });
    await musickit.play();

    const updatedPosition = moment().format('X') - broadcaster.updated.seconds;

    if (updatedPosition > 3) {
      await musickit.seekToTime(updatedPosition);
    }
  } else if (broadcaster.trackSeek) {
    await musickit.seekToTime(broadcaster.position);
  }
};

export const playTrack = (broadcaster) => async (dispatch, getState) => {
  try {
    const state = getState();

    if (broadcaster.player === 'spotify') {
      if (state.spotify.isOpen && state.spotify.isRunning && broadcaster.spotifyId) {
        await handleSpotifyPlayback(broadcaster);
      } else if (state.apple.musickit.isAuthorized && broadcaster.appleId) {
        await handleApplePlayback(state.apple.musickit, broadcaster);
      }
    } else if (broadcaster.player === 'apple') {
      if (state.apple.musickit.isAuthorized && broadcaster.appleId) {
        await handleApplePlayback(state.apple.musickit, broadcaster);
      } else if (state.spotify.isOpen && state.spotify.isRunning && broadcaster.spotifyId) {
        await handleSpotifyPlayback(broadcaster);
      }
    }
  } catch (error) {
    console.log('Play Track Error', error);
  }
};
