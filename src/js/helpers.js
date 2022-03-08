import * as config from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(config.TIMEOUT_SECONDS)]);

    const data = await res.json();

    if (!res.ok)
      throw new Error(`${data.message} Status code: (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export { getJSON, sendJSON, AJAX };
