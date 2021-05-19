npx    := .\node_modules\.bin
name   := fs_date_archivist
build  := deploy/win32/build/$(name)
rcedit := misc/rcedit-x64.exe

cli:
	node src/cli

gui: dist/index.js
	$(npx)\qode $<

dist: webpack.config.js $(wildcard src/*.js) $(wildcard misc/*)
	$(npx)\webpack

deploy: dist
	$(npx)\nodegui-packer --init $(name)
	$(npx)\nodegui-packer --pack dist

build: clean deploy
	move $(build) $@

build/$(name).exe: src/stub.c build
	clang $< -Ofast -fuse-ld=lld -o $@

release: build build/$(name).exe
	$(rcedit) $</qode.exe --set-icon misc/icon.ico
	$(rcedit) $</$(name).exe --set-icon misc/icon.ico

clean:
	-rd /s /q dist deploy build

.PHONY: cli gui
