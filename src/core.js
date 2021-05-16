const fs = require("fs");
const path = require("path");

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
      return fs.readdirSync(path, {withFileTypes: true});
   } catch (_) {
      return [];
   }
}

const walk_dir = parent =>
   readdir(parent)
      .map(dirent => path.join(parent, dirent.name));

const not_allowed = dirent => false
   || dirent.name.startsWith(".")
   || dirent.name === "node_modules"
   || dirent.name === "__pycache__";

const walk_dir_rec = parent =>
   readdir(parent)
      .flatMap(dirent => {
         const {name} = dirent;
         const fullpath = path.join(parent, name);
         if (dirent.isDirectory()) {
            return not_allowed(dirent) ? [] : [fullpath, ...walk_dir_rec(fullpath)];
         } else {
            return fullpath;
         }
      });

function fs_date_archivist(config) {
   const out = {
      depth1: Object.create(null),
      recursive: Object.create(null),
   };

   for (const parent of config.depth1) {
      const abspath = path.resolve(parent);
      const children = out.depth1[abspath] = [];
      for (const path of walk_dir(abspath)) {
         children.push(new Dated(path));
      }
   }

   for (const parent of config.recursive) {
      const abspath = path.resolve(parent);
      const children = out.recursive[abspath] = [];
      for (const path of walk_dir_rec(abspath)) {
         children.push(new Dated(path));
      }
   }

   return out;
}

module.exports = fs_date_archivist;
