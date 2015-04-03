install:
	npm install
	bower install # ?

develop:
	gulp bower-copy
	gulp develop

test:
	ls -la && sleep 1 &&  ls -a && sleep 1 && ls

publish:
	npm publish

docker_build:
	docker build -t hexlet/hexlet-ide:$(TAG) .

docker_bash:
	docker run -p 9000:9000 -it hexlet/hexlet-ide /bin/bash

docker_run:
	docker run -p 9000:9000 hexlet/hexlet-ide

.PHONY: test publish develop install
