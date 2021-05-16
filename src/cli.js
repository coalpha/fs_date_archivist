if (process.argv.length < 4) {
   console.log("index.js <input file> <output file>");
   return;
}

const [, , inf, ouf] = process.argv;

const fs_date_archivist = require("./core");

fs.writeFileSync(
   ouf,
   JSON.stringify(
      fs_date_archivist(
         JSON.parse(
            fs.readFileSync(
               inf
            )
         )
      )
   )
);
