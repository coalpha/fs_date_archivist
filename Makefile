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

build~3: $(build_3)
	-

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

cflags += -Oz
cflags += -nodefaultlibs
cflags += -ffreestanding
cflags += -fno-stack-check
cflags += -fno-stack-protector
cflags += -mno-stack-arg-probe
cflags += -Xlinker Kernel32.lib
cflags += -Xlinker Shell32.lib
cflags += -Xlinker /entry:start
cflags += -Xlinker /nodefaultlib
cflags += -Xlinker /subsystem:windows
cflags += -Xlinker "/libpath:C:\Program Files (x86)\Windows Kits\10\Lib\10.0.19041.0\um\x64"

$(build_3): $(build_2) src/stub.c
	node util/mv $< $@
	node util/rm $@/iconengines/qsvgicon.dll $@/imageformats/qgif.dll
	node util/rm $@/imageformats/qjpeg.dll $@/imageformats/qsvg.dll

	clang $(word 2,$^) $(cflags) -o $@/$n.exe
	$(call set_icon,$@/qode.exe)
	$(call set_icon,$@/$n.exe)


.PHONY: cli gui clean build
