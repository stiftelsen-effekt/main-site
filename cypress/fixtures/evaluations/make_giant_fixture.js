const fs = require("fs");

// Read all the json files in the directory and create a json file with all the data and filenames as keys
const files = fs.readdirSync("./");
const data = files.reduce((acc, file) => {
  if (file.endsWith(".json")) {
    // Remove the .json extension
    const key = file.slice(0, -5);
    const json = JSON.parse(fs.readFileSync(`./${file}`));
    acc[`${key}`] = json;
    console.log(acc);
    return acc;
  }
  return acc;
}, {});

fs.writeFileSync("./evaluations.json", JSON.stringify(data));
