// Middleware que protege rutas: exige el encabezado Authorization: Bearer <token>
const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const encabezado = req.headers.authorization || "";
  const [tipo, token] = encabezado.split(" ");
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ ok: false, mensaje: "Token no enviado" });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ ok: false, mensaje: "Token inválido o expirado" });
  }
}

module.exports = verificarToken;
