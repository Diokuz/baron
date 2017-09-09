.PHONY: all
all: build demo test

webpack_test:
	./node_modules/.bin/webpack-dev-server --config ./test/webpack/webpack.config.js

.PHONY: test
test:
	./node_modules/.bin/gulp t

new: test build

start:
	./node_modules/.bin/gulp build

.PHONY: build
build:
	./node_modules/.bin/webpack --config ./webpack/dev.config.js
	./node_modules/.bin/webpack --config ./webpack/prod.config.js -p
	cp ./dist/baron.js ./baron.js
	cp ./dist/baron.min.js ./baron.min.js

.PHONY: demo
demo: webpack
	cp ./dist/baron.js ./demo/baron.js
