FROM node:20-slim

# Instala dependências necessárias para o Chromium e o Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Define variáveis de ambiente para o Puppeteer não baixar o Chromium próprio
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências (inclui devDependencies necessárias para o build, ex: typescript)
RUN npm install --include=dev

# Copia o restante dos arquivos do projeto
COPY . .

# Gera a build do TypeScript
RUN npm run build

# Expõe a porta definida no seu server.ts (padrão 3000)
EXPOSE 3000

# No ambiente de produção, rodamos a versão compilada. 
# No docker-compose (desenvolvimento), o comando pode ser sobrescrito para npm run dev
CMD ["npm", "start"]