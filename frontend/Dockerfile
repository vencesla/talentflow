FROM node:20-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation avec mise en cache npm propre
RUN npm install

# Copie du reste du code source
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]