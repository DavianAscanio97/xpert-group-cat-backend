# Dockerfile para el backend de Cats App
# Usa Node.js 20 LTS como imagen base
FROM node:20-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache wget

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copia el código fuente
COPY . .

# Cambia la propiedad de los archivos al usuario nestjs
RUN chown -R nestjs:nodejs /app
USER nestjs

# Compila la aplicación TypeScript
RUN npm run build

# Instala solo las dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Expone el puerto 3000
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
