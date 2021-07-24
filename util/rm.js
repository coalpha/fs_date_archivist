const fs = require("fs");
process.argv.slice(2).forEach(arg => fs.unlinkSync(arg));
