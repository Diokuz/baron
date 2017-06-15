webpack:
	./node_modules/.bin/webpack-dev-server --config ./test/webpack/webpack.config.js

test:
	./node_modules/gulp/bin/gulp.js t

build:
	./node_modules/gulp/bin/gulp.js

new: test build

start:
	./node_modules/gulp/bin/gulp.js build
