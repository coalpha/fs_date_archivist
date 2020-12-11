const fs = require("fs");
const path = require("path");

const rawJSON = fs.readFileSync("paths.json");
const paths = JSON.parse(rawJSON);

const out = {
   depth1: {},
   recursive: {},
};

class Dated {
   constructor (path) {
      this.name = path;
      try {
         const stats = fs.lstatSync(path);
         this.isDir  = stats.isDirectory();
         this.access = stats.atime;
         this.modify = stats.mtime;
         this.change = stats.ctime;
         this.create = stats.birthtime;
      } catch (e) {
         this.access = null;
         this.modify = null;
         this.change = null;
         this.create = null;
      }
   }
}

function readdir(path) {
   try {
      return fs.readdirSync(path, { withFileTypes: true });
   } catch (_) {
      return [];
   }
}

const walkDir = parent =>
   readdir(parent)
      .map(dirent => path.join(parent, dirent.name));

const notAllowed = dirent =>
   dirent.name.startsWith(".") || dirent.name === "node_modules";

const walkDirRec = parent =>
   readdir(parent)
      .flatMap(dirent => {
         const { name } = dirent;
         const fullpath = path.join(parent, name);
         if (dirent.isDirectory()) {
            return notAllowed(dirent) ? [] : walkDirRec(fullpath);
         } else {
            return fullpath;
         }
      });

for (const parent of paths.depth1) {
   const children = out.depth1[parent] = [];
   for (const path of walkDir(parent)) {
      children.push(new Dated(path)); // wish I had |>
   }
}

for (const parent of paths.recursive) {
   const children = out.recursive[parent] = [];
   for (const path of walkDir(parent)) {
      children.push(new Dated(path));
   }
}

fs.writeFileSync("dates.json", JSON.stringify(out));
