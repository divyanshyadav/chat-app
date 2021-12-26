const { localWifiIp } = require("../build-utils/ip");

console.log("Local wifi ip:", localWifiIp);

module.exports = {
	API_URL: `http://${localWifiIp}:3000`,
	OAUTH_GOOGLE_CLIENT_ID:
		"585465649224-854158sjuc6d3ujpaei0c5vdb51odpbr.apps.googleusercontent.com",
};
