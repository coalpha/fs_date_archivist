export type dated = {
   name: string;
   isDir?: boolean;
   access: number | null;
   modify: number | null;
   change: number | null;
   create: number | null;
};

export type archive = {
   depth1:    {[path: string]: dated[]};
   recursive: {[path: string]: dated[]};
};
