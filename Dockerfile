FROM node:0.10.32-onbuild

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y locales && \
    dpkg-reconfigure locales && \
    locale-gen C.UTF-8 && \
    /usr/sbin/update-locale LANG=C.UTF-8

RUN echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen && \
  locale-gen

# Set default locale for the environment
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

RUN npm install -g bower \
                   gulp

RUN bower install --allow-root
RUN gulp bower-copy
RUN gulp prepublish
