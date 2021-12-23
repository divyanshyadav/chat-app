const { localWifiIp } = require("../build-utils/ip");

console.log("Local wifi ip:", localWifiIp);

module.exports = {
	API_URL: `http://${localWifiIp}:3000`,
};
