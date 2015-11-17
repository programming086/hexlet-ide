FROM node:5.0.0-onbuild

ENV DEBIAN_FRONTEND noninteractive

RUN npm install -g bower gulp

RUN bower install --allow-root
RUN make prepublish
RUN make assets
