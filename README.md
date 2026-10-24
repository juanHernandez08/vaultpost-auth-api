# Vaultpost · Servicio web de registro e inicio de sesión

Servicio web REST que permite **registrar usuarios** e **iniciar sesión**. Recibe un usuario y una contraseña: si la autenticación es correcta responde *"Autenticación satisfactoria"* y entrega un token JWT; en caso contrario devuelve *"Error en la autenticación"*.

Evidencias: GA7-220501096-AA5-EV01 (diseño y desarrollo) y GA7-220501096-AA5-EV02 (pruebas con Postman).

## Tecnologías

Node.js 20+, Express 4, MySQL 8 / MariaDB (mysql2), bcryptjs (hash de contraseñas), jsonwebtoken (JWT), dotenv. Pruebas: colección de Postman ejecutada con Newman.

## Estructura

```
vaultpost-auth-api/
├── src/
│   ├── app.js                      ← servidor Express y manejo de errores
│   ├── routes/authRoutes.js        ← definición de los endpoints
│   ├── controllers/authController.js ← registro, login y perfil
│   ├── middleware/verificarToken.js  ← protección con JWT
│   └── db/conexion.js              ← pool de conexiones MySQL
├── sql/esquema.sql                 ← base de datos y tabla usuarios
├── postman/
│   └── Vaultpost-Auth-API.postman_collection.json
├── ENDPOINTS.md
└── .env.example
```

## Instalación

```bash
npm install
mysql -u root -p < sql/esquema.sql      # crea la BD, la tabla y el usuario de la app
cp .env.example .env                    # completar DB_PASSWORD y JWT_SECRET
npm start                               # http://localhost:3000
npm test                                # ejecuta la colección de Postman con Newman
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/salud` | Estado del servicio |
| POST | `/api/auth/registro` | Registra un usuario |
| POST | `/api/auth/login` | Inicia sesión y devuelve un token |
| GET | `/api/auth/perfil` | Datos del usuario autenticado (requiere token) |

El detalle de cada endpoint está en [ENDPOINTS.md](ENDPOINTS.md).

## Seguridad

- Las contraseñas se guardan como hash bcrypt (10 rondas), nunca en texto plano.
- Consultas parametrizadas: sin riesgo de inyección SQL.
- El login responde el mismo mensaje si el usuario no existe o si la contraseña es incorrecta.
- El token JWT expira en 2 horas y el secreto se lee de variables de entorno.
- El usuario de base de datos de la aplicación solo tiene permisos SELECT, INSERT y UPDATE sobre la tabla.

## Autores

Juan Esteban Hernández y Dayana Andrea Gómez · Análisis y Desarrollo de Software · SENA · Ficha 3336144
