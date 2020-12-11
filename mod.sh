#!/usr/bin/env bash
exec 1>mod.csv

while read upath; do
   echo ----- DO $upath ----- 1>&2
   find "$upath" \
   -type f \
   -not -path "*/node_modules/*" \
   -not -path "*/.*/*" \
   -exec echo -n {}, ";" \
   -exec date -Iseconds -r "{}" ";"
   echo ----- OK $upath ----- 1>&2
done < "paths.txt"
