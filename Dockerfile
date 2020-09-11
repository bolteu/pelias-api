# base image
FROM pelias/baseimage
USER pelias

# I think we should rely on runtime variables as opposed to build variables
# This is just a temporary solution until the automated deployment part is fixed
ARG CONFIG_JSON

# Where the app is built and run inside the docker fs
ENV WORK=/home/pelias

ENV PELIAS_CONFIG=$CONFIG_JSON

WORKDIR ${WORK}

# copy package.json first to prevent npm install being rerun when only code changes
COPY ./package.json ${WORK}
RUN npm install

COPY . ${WORK}

# Test if the configuration file received as a parameter exists
# This is just a temporary solution until the automated deployment part is fixed
RUN if [ -f $PELIAS_CONFIG ]; then exit 0; else echo "A valid config json should be provided for Pelias. Example: docker build --build-arg CONFIG_JSON=pelias-bolt-actived.json -t taxify/taxify-pelias-api:fix-pelias-forward-config ."; exit 1; fi;

# only allow containers to succeed if tests pass
RUN npm test

# start service
CMD PELIAS_CONFIG=${PELIAS_CONFIG} npm run start
