dates.json:
	node index.js paths.json $@

gui:
	.\node_modules\.bin\qode.cmd src/gui

.PHONY: dates.json dist
