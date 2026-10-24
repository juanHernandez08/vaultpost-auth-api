// Servicio web de registro e inicio de sesión — Vaultpost
require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json({ limit: "10kb" }));

// Verificación de estado del servicio
app.get("/api/salud", (req, res) => res.json({ ok: true, servicio: "vaultpost-auth-api" }));

app.use("/api/auth", authRoutes);

// Ruta no encontrada
app.use((req, res) => res.status(404).json({ ok: false, mensaje: "Ruta no encontrada" }));

// Errores no controlados (por ejemplo, JSON mal formado o fallas de base de datos)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ ok: false, mensaje: "El cuerpo de la petición no es un JSON válido" });
  }
  console.error(err);
  return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
});

if (require.main === module) {
  if (!process.env.JWT_SECRET) {
    console.error("Falta la variable JWT_SECRET en el archivo .env");
    process.exit(1);
  }
  const puerto = Number(process.env.PORT || 3000);
  app.listen(puerto, () => console.log(`API escuchando en http://localhost:${puerto}`));
}

module.exports = app;
