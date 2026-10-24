// Lógica del servicio de autenticación: registro, inicio de sesión y perfil.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/conexion");

const USUARIO_REGEX = /^[a-zA-Z0-9._-]{4,30}$/;
const SALT_ROUNDS = 10;

/** Valida usuario y contraseña; devuelve un mensaje de error o null si todo está bien. */
function validarCredenciales(usuario, contrasena) {
  if (typeof usuario !== "string" || typeof contrasena !== "string") {
    return "Debe enviar los campos usuario y contrasena";
  }
  if (!USUARIO_REGEX.test(usuario)) {
    return "El usuario debe tener entre 4 y 30 caracteres: letras, números, punto, guion o guion bajo";
  }
  if (contrasena.length < 8 || !/[A-Za-z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
    return "La contraseña debe tener mínimo 8 caracteres e incluir letras y números";
  }
  return null;
}

/** POST /api/auth/registro — crea un usuario nuevo. */
async function registrar(req, res, next) {
  try {
    const { usuario, contrasena } = req.body || {};
    const error = validarCredenciales(usuario, contrasena);
    if (error) {
      return res.status(400).json({ ok: false, mensaje: error });
    }
    // La contraseña nunca se guarda en texto plano: se guarda su hash con bcrypt
    const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
    const [resultado] = await pool.execute(
      "INSERT INTO usuarios (usuario, contrasena_hash) VALUES (?, ?)",
      [usuario.toLowerCase(), hash]
    );
    return res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado correctamente",
      usuario: { id: resultado.insertId, usuario: usuario.toLowerCase() },
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ ok: false, mensaje: "El usuario ya existe" });
    }
    return next(err);
  }
}

/** POST /api/auth/login — valida las credenciales y entrega un token JWT. */
async function iniciarSesion(req, res, next) {
  try {
    const { usuario, contrasena } = req.body || {};
    if (typeof usuario !== "string" || typeof contrasena !== "string" || !usuario || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: "Debe enviar los campos usuario y contrasena" });
    }
    const [filas] = await pool.execute(
      "SELECT id, usuario, contrasena_hash FROM usuarios WHERE usuario = ?",
      [usuario.toLowerCase()]
    );
    const encontrado = filas[0];
    const valida = encontrado ? await bcrypt.compare(contrasena, encontrado.contrasena_hash) : false;
    if (!valida) {
      // Mismo mensaje para usuario inexistente o contraseña errada: no revela qué falló
      return res.status(401).json({ ok: false, mensaje: "Error en la autenticación: usuario o contraseña incorrectos" });
    }
    await pool.execute("UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?", [encontrado.id]);
    const token = jwt.sign({ sub: encontrado.id, usuario: encontrado.usuario }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.json({ ok: true, mensaje: "Autenticación satisfactoria", token });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/auth/perfil — devuelve los datos del usuario dueño del token. */
async function perfil(req, res, next) {
  try {
    const [filas] = await pool.execute(
      "SELECT id, usuario, creado_en, ultimo_acceso FROM usuarios WHERE id = ?",
      [req.usuario.sub]
    );
    if (!filas[0]) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }
    return res.json({ ok: true, usuario: filas[0] });
  } catch (err) {
    return next(err);
  }
}

module.exports = { registrar, iniciarSesion, perfil, validarCredenciales };
