const { v4: uuidv4 } = require('uuid');

function getOrCreateDeviceId(req, res) {

  let deviceId = req.cookies.deviceId;

  if (!deviceId) {
    deviceId = uuidv4();

    res.cookie('deviceId', deviceId, {
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'Lax',
      secure: false
    });

    console.log(`Novo deviceId gerado: ${deviceId}`);
  }
  return deviceId;
}

module.exports = { getOrCreateDeviceId };
