-- Base de datos del servicio de autenticación
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS vaultpost_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vaultpost_auth;

CREATE TABLE IF NOT EXISTS usuarios (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  usuario          VARCHAR(30)   NOT NULL,
  contrasena_hash  CHAR(60)      NOT NULL COMMENT 'Hash bcrypt, nunca la contraseña en texto plano',
  creado_en        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso    DATETIME      NULL,
  CONSTRAINT pk_usuarios PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_usuario UNIQUE (usuario)
) ENGINE=InnoDB;

-- Usuario de la aplicación con permisos mínimos
CREATE USER IF NOT EXISTS 'vaultpost_api'@'localhost' IDENTIFIED BY 'cambiar_esta_clave';
GRANT SELECT, INSERT, UPDATE ON vaultpost_auth.usuarios TO 'vaultpost_api'@'localhost';
