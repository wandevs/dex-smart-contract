FROM node:11.10.0
WORKDIR /app
COPY . /app

# RUN npm i
# RUN npm run compile
# ENTRYPOINT [ "npm", "run",  "node" ]
# CMD ["truffle", "exec",  "scripts/deploy_development_node.js"]
# RUN npm run node
# RUN node_modules/.bin/truffle exec scripts/deploy_development_node.js
