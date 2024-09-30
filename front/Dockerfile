# React用Dockerfile
FROM node:14
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install

RUN npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-charts
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

COPY . .
 
RUN npm run build
 
EXPOSE 3001
 
CMD ["npx", "serve", "-s", "build", "-l", "3001"]