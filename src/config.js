import config from "../config.json";

if (config == null) {
  console.log(
    "config.json is not found, please create one in the root directory."
  );
  process.exit();
}

const missingProperty = property => {
  console.log(`Could not read value of property (${property})`);
  console.log("Will now exit, please add that property to your config.json");
  process.exit(1);
};

const get = property => {
  if (config[property] == null) {
    missingProperty(property);
  }

  return config[property];
};

const getToken = () => {
  return get("token");
};

const getPrefix = () => {
  return get("prefix");
};

module.exports = {
  getToken,
  getPrefix
};
