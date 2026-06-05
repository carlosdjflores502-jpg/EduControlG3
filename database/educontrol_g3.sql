-- ==========================================================
-- Base de datos: EduControl G3
-- Sistema de Control Academico
-- ==========================================================

CREATE DATABASE IF NOT EXISTS educontrol_g3;
USE educontrol_g3;

-- ==========================================================
-- Eliminacion de tablas en orden correcto por llaves foraneas
-- ==========================================================

DROP TABLE IF EXISTS calificaciones;
DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS alumnos;
DROP TABLE IF EXISTS usuarios;

-- ==========================================================
-- Tabla: usuarios
-- Almacena usuarios administrativos del sistema
-- ==========================================================

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('Administrador','Secretaria','Docente') NOT NULL,
  estado ENUM('Activo','Inactivo') DEFAULT 'Activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Tabla: alumnos
-- Almacena informacion academica y personal de estudiantes
-- ==========================================================

CREATE TABLE alumnos (
  id_alumno INT AUTO_INCREMENT PRIMARY KEY,
  carnet VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  carrera VARCHAR(100) NOT NULL,
  estado ENUM('Activo','Inactivo') DEFAULT 'Activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Tabla: cursos
-- Almacena los cursos disponibles para inscripcion
-- ==========================================================

CREATE TABLE cursos (
  id_curso INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  creditos INT NOT NULL,
  catedratico VARCHAR(100) NOT NULL,
  horario VARCHAR(100),
  estado ENUM('Activo','Inactivo') DEFAULT 'Activo'
);

-- ==========================================================
-- Tabla: inscripciones
-- Relaciona alumnos con cursos inscritos
-- ==========================================================

CREATE TABLE inscripciones (
  id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
  id_alumno INT NOT NULL,
  id_curso INT NOT NULL,
  fecha_inscripcion DATE NOT NULL,
  estado ENUM('Activa','Cancelada','Finalizada') DEFAULT 'Activa',
  FOREIGN KEY (id_alumno) REFERENCES alumnos(id_alumno),
  FOREIGN KEY (id_curso) REFERENCES cursos(id_curso),
  UNIQUE (id_alumno, id_curso)
);

-- ==========================================================
-- Tabla: calificaciones
-- Registra las notas asociadas a cada inscripcion
-- ==========================================================

CREATE TABLE calificaciones (
  id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_inscripcion INT NOT NULL,
  nota_parcial DECIMAL(5,2) NOT NULL,
  nota_final DECIMAL(5,2) NOT NULL,
  promedio DECIMAL(5,2) NOT NULL,
  resultado ENUM('Aprobado','Reprobado') NOT NULL,
  observaciones TEXT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_inscripcion) REFERENCES inscripciones(id_inscripcion)
);

-- ==========================================================
-- Datos de prueba: usuarios
-- ==========================================================

INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES
('Carlos Flores', 'admin@educontrolg3.com', 'admin123', 'Administrador', 'Activo'),
('Maria Lopez', 'secretaria@educontrolg3.com', 'secretaria123', 'Secretaria', 'Activo'),
('Jose Ramirez', 'docente@educontrolg3.com', 'docente123', 'Docente', 'Activo');

-- ==========================================================
-- Datos de prueba: alumnos
-- ==========================================================

INSERT INTO alumnos (carnet, nombre, apellido, correo, telefono, carrera, estado) VALUES
('2026001', 'Ana', 'Martinez', 'ana.martinez@educontrolg3.com', '5551-1001', 'Ingenieria en Sistemas', 'Activo'),
('2026002', 'Luis', 'Garcia', 'luis.garcia@educontrolg3.com', '5551-1002', 'Ingenieria en Sistemas', 'Activo'),
('2026003', 'Sofia', 'Hernandez', 'sofia.hernandez@educontrolg3.com', '5551-1003', 'Administracion de Empresas', 'Activo'),
('2026004', 'Diego', 'Castillo', 'diego.castillo@educontrolg3.com', '5551-1004', 'Contaduria Publica', 'Activo'),
('2026005', 'Valeria', 'Morales', 'valeria.morales@educontrolg3.com', '5551-1005', 'Ingenieria Industrial', 'Activo');

-- ==========================================================
-- Datos de prueba: cursos
-- ==========================================================

INSERT INTO cursos (codigo, nombre, descripcion, creditos, catedratico, horario, estado) VALUES
('ISW-901', 'Mantenimiento de Software', 'Curso orientado al analisis, mejora y mantenimiento de aplicaciones.', 4, 'Jose Ramirez', 'Lunes 18:00 - 20:00', 'Activo'),
('ISW-902', 'Bases de Datos', 'Curso sobre diseno, administracion y consultas en bases de datos.', 4, 'Elena Gomez', 'Martes 18:00 - 20:00', 'Activo'),
('ISW-903', 'Ingenieria de Software', 'Curso sobre procesos, requisitos y arquitectura de software.', 5, 'Ricardo Perez', 'Miercoles 18:00 - 21:00', 'Activo'),
('ISW-904', 'Programacion Web', 'Curso de desarrollo de aplicaciones web con tecnologias modernas.', 4, 'Laura Torres', 'Jueves 18:00 - 20:00', 'Activo');

-- ==========================================================
-- Datos de prueba: inscripciones
-- ==========================================================

INSERT INTO inscripciones (id_alumno, id_curso, fecha_inscripcion, estado) VALUES
(1, 1, '2026-06-01', 'Activa'),
(2, 1, '2026-06-01', 'Activa'),
(3, 2, '2026-06-01', 'Activa'),
(4, 3, '2026-06-01', 'Activa'),
(5, 4, '2026-06-01', 'Activa');

-- ==========================================================
-- Datos de prueba: calificaciones
-- ==========================================================

INSERT INTO calificaciones (id_inscripcion, nota_parcial, nota_final, promedio, resultado, observaciones) VALUES
(1, 82.50, 88.00, 85.25, 'Aprobado', 'Buen desempeno durante el curso.'),
(2, 70.00, 74.00, 72.00, 'Aprobado', 'Cumple con los criterios minimos.'),
(3, 91.00, 95.00, 93.00, 'Aprobado', 'Excelente participacion.'),
(4, 58.00, 61.00, 59.50, 'Reprobado', 'Debe reforzar contenidos principales.'),
(5, 76.00, 80.00, 78.00, 'Aprobado', 'Entrega tareas de forma constante.');
