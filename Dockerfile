# base image
FROM pelias/baseimage
USER pelias

# Where the app is built and run inside the docker fs
ENV WORK=/home/pelias
ENV PELIAS_CONFIG=pelias-bolt.json

WORKDIR ${WORK}

# copy package.json first to prevent npm install being rerun when only code changes
COPY ./package.json ${WORK}
RUN npm install

COPY . ${WORK}

# only allow containers to succeed if tests pass
RUN npm test

# start service
CMD PELIAS_CONFIG=${PELIAS_CONFIG} npm run start
