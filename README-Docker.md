# 🐳 Backend Docker Setup

## Comandos Básicos

```bash
# Construir y levantar backend + MongoDB
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Ver estado
docker-compose ps

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## Acceso

- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

## Variables de Entorno

Edita las variables en `docker-compose.yml`:

```yaml
environment:
  JWT_SECRET: tu-clave-secreta
  THE_CAT_API_KEY: tu-clave-de-thecatapi
```
