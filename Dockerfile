FROM node:14.5.0 as builder

WORKDIR /usr/src/app

COPY package.json \
  package-lock.json \
  tsconfig.json \
  /usr/src/app/

COPY src \
  /usr/src/app/src

RUN npm install
RUN npm run prepare

# phase 2
FROM node:14.5.0
WORKDIR /usr/src/app

COPY package.json \
  package-lock.json \
  /usr/src/app/
COPY --from=builder /usr/src/app/lib \
  /usr/src/app/lib

RUN npm install --production

EXPOSE 5000

CMD ["npm", "run", "start"]