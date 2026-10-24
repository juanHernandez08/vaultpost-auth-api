# Endpoints · Vaultpost Auth API

URL base local: `http://localhost:3000`
Formato: JSON (`Content-Type: application/json`)

## GET /api/salud
Verifica que el servicio esté activo.

**200 OK**
```json
{ "ok": true, "servicio": "vaultpost-auth-api" }
```

## POST /api/auth/registro
Registra un usuario nuevo.

**Cuerpo**
```json
{ "usuario": "juan.hernandez", "contrasena": "Vaultpost2026" }
```
Reglas: usuario de 4 a 30 caracteres (letras, números, `.` `_` `-`); contraseña de mínimo 8 caracteres con letras y números.

| Código | Caso | Respuesta |
|---|---|---|
| 201 | Registro exitoso | `{ "ok": true, "mensaje": "Usuario registrado correctamente", "usuario": { "id": 1, "usuario": "juan.hernandez" } }` |
| 400 | Datos inválidos | `{ "ok": false, "mensaje": "La contraseña debe tener mínimo 8 caracteres e incluir letras y números" }` |
| 409 | Usuario existente | `{ "ok": false, "mensaje": "El usuario ya existe" }` |

## POST /api/auth/login
Valida las credenciales.

**Cuerpo**
```json
{ "usuario": "juan.hernandez", "contrasena": "Vaultpost2026" }
```

| Código | Caso | Respuesta |
|---|---|---|
| 200 | Credenciales correctas | `{ "ok": true, "mensaje": "Autenticación satisfactoria", "token": "eyJhbGciOi..." }` |
| 400 | Faltan campos o JSON inválido | `{ "ok": false, "mensaje": "Debe enviar los campos usuario y contrasena" }` |
| 401 | Credenciales incorrectas | `{ "ok": false, "mensaje": "Error en la autenticación: usuario o contraseña incorrectos" }` |

## GET /api/auth/perfil
Devuelve los datos del usuario autenticado.

**Encabezado:** `Authorization: Bearer <token>`

| Código | Caso | Respuesta |
|---|---|---|
| 200 | Token válido | `{ "ok": true, "usuario": { "id": 1, "usuario": "juan.hernandez", "creado_en": "...", "ultimo_acceso": "..." } }` |
| 401 | Sin token o token inválido | `{ "ok": false, "mensaje": "Token no enviado" }` |
