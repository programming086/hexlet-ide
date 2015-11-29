install:
	npm install
	bower install # ?

production:
	NODE_ENV=production HEXLET_IDE_PORT=8000  ./bin/hexlet-ide.js -r test/fixtures/project -a test/fixtures/project

develop:
	./node_modules/gulp/bin/gulp.js fa-copy;
	NODE_ENV=development HEXLET_IDE_PORT=9000 TEST_DIR=test/fixtures/project ./node_modules/nodemon/bin/nodemon.js

prepublish:
	NODE_ENV=production ./node_modules/webpack/bin/webpack.js --config ./tools/webpack/production.config.js

assets:
	NODE_ENV=production ./node_modules/gulp/bin/gulp.js assets

test:
	npm test

docker_build:
	docker build -t hexlet/hexlet-ide:$(TAG) .

docker_bash:
	docker run -p 9000:9000 -it hexlet/hexlet-ide /bin/bash

docker_run:
	docker run -p 9000:9000 hexlet/hexlet-ide

.PHONY: test publish develop install
