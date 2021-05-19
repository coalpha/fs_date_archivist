import {archive} from "../index";

type config = {
   depth1: string[];
   recursive: string[];
};

declare function fs_date_archivist(config: config): archive;

export = fs_date_archivist;
