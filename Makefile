# there are several steps that need to occur in this build system
# build/1_webpack webpack packs files into a compiled index.js
# build/2_packer nodegui-packer creates a standalone package directory
# build/3_dist stub.c is compiled and executable files are patched with icons
n     := fs-date-archivist
build := deploy/win32/build/$(name)
self  := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
PATH  := $(self)\node_modules\.bin;$(PATH)

webpack_reqs := webpack.config.js $(wildcard src/*.js) $(wildcard res/*)

build_0 := build/0_debug/index.js
build_1 := build/1_webpack/index.js
build_2 := build/2_packer/deploy/win32/build/$n
build_3 := build/3_dist

usage:
	@echo make
	@echo cli   : runs the cli
	@echo gui   : build and run the gui
	@echo build : build and release

cli:
	node src/cli

gui: $(build_0)
	qode $<

clean:
	-rd /s /q build

build: clean $(build_3)
	-

$(build_0): $(webpack_reqs)
	webpack

$(build_1): $(webpack_reqs)
	webpack --env production

$(build_2): $(build_1)
	-mkdir build\2_packer
	cd build\2_packer && nodegui-packer --init $n
	cd build\2_packer && nodegui-packer --pack ..\1_webpack

define set_icon =
	vendor/rcedit/rcedit-x64.exe $1 --set-icon res/icon.ico
endef

$(build_3): $(build_2) src/stub.c
	-move $< $@
	clang $(word 2,$^) -Ofast -fuse-ld=lld -o $@/$n.exe
	$(call set_icon,$@/$n.exe)
	$(call set_icon,$@/qode.exe)

.PHONY: cli gui clean build
