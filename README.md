# Cats API Backend

API backend para la gestión de gatos desarrollada con NestJS, MongoDB y TheCatAPI.

## 🚀 Características

- **NestJS Framework**: Framework Node.js escalable y modular
- **MongoDB**: Base de datos NoSQL para persistencia de datos
- **JWT Authentication**: Autenticación segura con tokens JWT
- **TheCatAPI Integration**: Integración con API externa para datos de gatos
- **Swagger Documentation**: Documentación automática de la API
- **Validation**: Validación de datos con class-validator
- **Testing**: Pruebas unitarias con Jest
- **Clean Architecture**: Arquitectura limpia siguiendo principios SOLID

## 📋 Requisitos

- Node.js (v18 o superior)
- MongoDB (v5 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cats-api
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   THECAT_API_KEY=live_your-api-key-here
   THECAT_API_BASE_URL=https://api.thecatapi.com/v1
   PORT=3000
   NODE_ENV=development
   ```

4. **Iniciar MongoDB**
   ```bash
   mongod
   ```

5. **Ejecutar la aplicación**
   ```bash
   # Desarrollo
   npm run start:dev
   
   # Producción
   npm run build
   npm run start:prod
   ```

## 📚 Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación de Swagger en:
- **Swagger UI**: http://localhost:3000/api

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── dto/             # DTOs de autenticación
│   ├── guards/          # Guards de autenticación
│   ├── strategies/      # Estrategias de Passport
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── cats/                # Módulo de gatos
│   ├── dto/             # DTOs de gatos
│   ├── cats.controller.ts
│   ├── cats.service.ts
│   └── cats.module.ts
├── images/              # Módulo de imágenes
│   ├── dto/             # DTOs de imágenes
│   ├── images.controller.ts
│   ├── images.service.ts
│   └── images.module.ts
├── users/               # Módulo de usuarios
│   ├── dto/             # DTOs de usuarios
│   ├── schemas/         # Esquemas de MongoDB
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── app.module.ts        # Módulo principal
└── main.ts             # Punto de entrada
```

## 🔗 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Obtener perfil del usuario (requiere autenticación)

### Gatos
- `GET /breeds` - Obtener todas las razas de gatos
- `GET /breeds/:breed_id` - Obtener raza específica por ID
- `GET /breeds/search/:searchTerm` - Buscar razas por término

### Imágenes
- `GET /images` - Obtener imágenes con filtros
- `GET /images/bybreedid?breed_id=:id` - Obtener imágenes por raza
- `GET /images/:imageId` - Obtener imagen específica por ID

### Usuarios
- `GET /users` - Obtener todos los usuarios (requiere autenticación)
- `GET /users/:id` - Obtener usuario específico (requiere autenticación)
- `DELETE /users/:id` - Desactivar usuario (requiere autenticación)

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar pruebas e2e
npm run test:e2e
```

## 🔧 Scripts Disponibles

- `npm run build` - Compilar la aplicación
- `npm run start` - Iniciar la aplicación
- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run start:debug` - Iniciar en modo debug
- `npm run start:prod` - Iniciar en modo producción
- `npm run lint` - Ejecutar linter
- `npm run format` - Formatear código

## 🛡️ Seguridad

- **JWT Tokens**: Autenticación basada en tokens JWT
- **Password Hashing**: Contraseñas hasheadas con bcrypt
- **Input Validation**: Validación de entrada con class-validator
- **CORS**: Configuración de CORS para seguridad
- **Environment Variables**: Variables sensibles en archivos de entorno

## 📝 Notas de Desarrollo

- El código está documentado con JSDoc en español
- Se siguen principios de Clean Architecture
- Implementación de inyección de dependencias de NestJS
- Manejo de errores centralizado
- Logging estructurado

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b https://github.com/DavianAscanio97/xpert-group-cat-backend`)
3. Commit tus cambios (`git commit -m 'agregar mesnaje'`)
4. Push a la rama (`git push origin feature/clonar`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
