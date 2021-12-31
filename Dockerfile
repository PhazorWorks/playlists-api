# ---- Base Node ----
FROM node:16.13.1-alpine3.14 AS base
WORKDIR /app
COPY package.json .

# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules

# -- Release --
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# copy app sources
COPY . .

EXPOSE 3030
CMD [ "node", "index.js" ]
