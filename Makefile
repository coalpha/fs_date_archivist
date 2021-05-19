npx    := .\node_modules\.bin
name   := fs_date_archivist
build  := deploy/win32/build/$(name)
rcedit := misc/rcedit-x64.exe

cli:
	node src/cli

gui: dist/index.js
	$(npx)\qode $<

dist/index.js:
	$(npx)\webpack

build: clean dist/index.js
	$(npx)\nodegui-packer --init $(name)
	$(npx)\nodegui-packer --pack dist
	move $(build) $@
	$(rcedit) $@/qode.exe --set-icon misc/icon.ico

clean:
	-rd /s /q dist deploy build

.PHONY: cli gui dist/index.js build bundle deploy
