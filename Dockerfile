FROM node:9.11-alpine
LABEL maintainer="Ahmad Nassri <ahmad@ahmadnassri.com>"

RUN npm i -g npm@5

COPY lib /app/lib
COPY index.js /app/
COPY package.json /app/
COPY package-lock.json /app/


WORKDIR /app/
RUN npm ci
RUN chmod +x index.js

VOLUME /code/
WORKDIR /code/

ENTRYPOINT ["/app/index.js"]
CMD ["run"]
