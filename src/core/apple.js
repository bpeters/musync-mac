import applescript from 'applescript';

const scriptPath = process.env.NODE_ENV === 'development' ? `${nw.__dirname}/public/scripts` : `${nw.__dirname}/scripts`;

export const isOpen = async () => new Promise((resolve, reject) => {
  applescript.execFile(`${scriptPath}/appleIsOpen.applescript`, (err, result) => {
    if (err) {
      console.log(err, 'ERROR - APPLE - IS OPEN');
      return reject(err);
    } else {
      return resolve(result);
    }
  });
});

export const isRunning = async () => new Promise((resolve, reject) => {
  applescript.execString('get running of application "iTunes"', (err, result) => {
    if (err) {
      console.log(err, 'ERROR - APPLE - IS RUNNING');
      return reject(err);
    } else {
      return resolve(result);
    }
  });
});

export const getState = async () => new Promise((resolve, reject) => {
  applescript.execFile(`${scriptPath}/appleGetState.applescript`, (err, result) => {
    if (err || !result) {
      console.log(err, 'ERROR - APPLE - GET STATE');
      return reject(err);
    } else {
      const data = JSON.parse(result);
      return resolve(data.state);
    }
  });
});

export const getTrack = async () => new Promise((resolve, reject) => {
  applescript.execFile(`${scriptPath}/appleGetTrack.applescript`, (err, result) => {
    if (err || !result) {
      console.log(err, 'ERROR - APPLE - GET TRACK');
      return reject(err);
    } else {
      return resolve(JSON.parse(result));
    }
  });
});

export const jumpTo = async (position) => new Promise((resolve, reject) => {
  applescript.execString(`tell application "iTunes" to set player position to ${position}`, (err) => {
    if (err) {
      console.log(err, 'ERROR - APPLE - JUMP TO');
      return reject(err);
    } else {
      return resolve();
    }
  });
});
