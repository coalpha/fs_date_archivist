type config = {
   depth1: string[];
   recursive: string[];
};

type Dated = {
   name: string;
   isDir?: boolean;
   access: number | null;
   modify: number | null;
   change: number | null;
   create: number | null;
}

type output = {
   depth1: {[path: string]: Dated[]};
   recursive: {[path: string]: Dated[]};
};

declare function fs_date_archivist(config: config): output;

export = fs_date_archivist;
