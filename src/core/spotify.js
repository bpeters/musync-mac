import applescript from 'applescript';

const scriptPath = process.env.NODE_ENV === 'development' ? `${nw.__dirname}/public/scripts` : `${nw.__dirname}/scripts`;

export const isOpen = async () => new Promise((resolve, reject) => {
  applescript.execFile(`${scriptPath}/spotifyIsOpen.applescript`, (err, result) => {
    if (err) {
      console.log(err, 'ERROR - SPOTIFY - IS OPEN');
      return reject(err);
    } else {
      return resolve(result);
    }
  });
});

export const isRunning = async () => new Promise((resolve, reject) => {
  applescript.execString('get running of application "Spotify"', (err, result) => {
    if (err) {
      console.log(err, 'ERROR - SPOTIFY - IS RUNNING');
      return reject(err);
    } else {
      return resolve(result);
    }
  });
});

export const getState = async () => new Promise((resolve, reject) => {
  applescript.execFile(`${scriptPath}/spotifyGetState.applescript`, (err, result) => {
    if (err || !result) {
      console.log(err, 'ERROR - SPOTIFY - GET STATE');
      return reject(err);
    } else {
      const data = JSON.parse(result);
      return resolve(data.state);
    }
  });
});

export const getTrack = async () => new Promise((resolve, reject) => {
  applescript.execFile(`${scriptPath}/spotifyGetTrack.applescript`, (err, result) => {
    if (err || !result) {
      console.log(err, 'ERROR - SPOTIFY - GET TRACK');
      return reject(err);
    } else {
      return resolve(JSON.parse(result));
    }
  });
});

export const jumpTo = async (position) => new Promise((resolve, reject) => {
  applescript.execString(`tell application "Spotify" to set player position to ${position}`, (err) => {
    if (err) {
      console.log(err, 'ERROR - SPOTIFY - JUMP TO');
      return reject(err);
    } else {
      return resolve();
    }
  });
});

export const playTrack = async (id) => new Promise((resolve, reject) => {
  applescript.execString(`tell application "Spotify" to play track "${id}"`, (err) => {
    if (err) {
      console.log(err, 'ERROR - SPOTIFY - PLAY TRACK');
      return reject(err);
    } else {
      return resolve();
    }
  });
});
