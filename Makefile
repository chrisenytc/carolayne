#
# carolayne
# https://github.com/chrisenytc/carolayne
#
# Copyright (c) 2014, Christopher EnyTC
# Licensed under the MIT license.
#

test:
	@NODE_ENV=test ./node_modules/gulp/bin/gulp.js test

build:
	./node_modules/gulp/bin/gulp.js clean & ./node_modules/gulp/bin/gulp.js build

.PHONY: test