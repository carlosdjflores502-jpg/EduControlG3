# Hallazgos Criticos para SonarQube

## Introduccion

Este documento registra hallazgos importantes identificados en el codigo actual de EduControl G3 como preparacion para el informe de Mantenimiento de Software. Los cambios descritos en la seccion "DESPUES" son propuestas de refactorizacion y no fueron aplicados al sistema. Su objetivo es servir como base para documentar el antes y despues requerido por el proyecto.

## Tabla resumen de hallazgos

| No. | Tipo | Archivo o modulo afectado | Descripcion breve | Prioridad |
| --- | --- | --- | --- | --- |
| 1 | Vulnerabilidad | `controllers/auth.controller.js` | Comparacion de contrasenas en texto plano. | Alta |
| 2 | Vulnerabilidad | `app.js` | Secreto de sesion con valor por defecto en el codigo. | Alta |
| 3 | Code Smell | `controllers/alumnos.controller.js`, `controllers/cursos.controller.js`, `controllers/calificaciones.controller.js` | Validaciones, mensajes y renderizado de formularios repetidos en controladores CRUD. | Media |
| 4 | Code Smell | `models/*.model.js` | Manejo repetido de conexion MySQL en cada funcion de modelo. | Media |

---

## Hallazgo 1

### Tipo

Vulnerabilidad

### Archivo o modulo afectado

`controllers/auth.controller.js`

### Descripcion del problema

El login compara la contrasena recibida desde el formulario directamente contra el valor almacenado en la base de datos. Actualmente la base de datos de prueba usa contrasenas simples, pero en un sistema real esta practica expone credenciales sensibles si la tabla `usuarios` es comprometida.

### Riesgo si no se corrige

Si un atacante obtiene acceso a la base de datos, podria leer las contrasenas de los usuarios sin necesidad de descifrarlas. Esto compromete cuentas administrativas, permite reutilizacion de credenciales en otros sistemas y representa un riesgo alto de seguridad.

### Codigo ANTES

```js
// Para seguridad real, mas adelante se recomienda reemplazar esta comparacion por bcrypt.compare().
if (usuario.password !== password) {
  return res.render('auth/login', {
    title: 'Login - EduControl G3',
    errorMessage: 'Credenciales incorrectas.',
    formData
  });
}
```

### Codigo DESPUES propuesto

```js
const bcrypt = require('bcrypt');

const passwordValida = await bcrypt.compare(password, usuario.password);

if (!passwordValida) {
  return res.render('auth/login', {
    title: 'Login - EduControl G3',
    errorMessage: 'Credenciales incorrectas.',
    formData
  });
}
```

### Beneficio del cambio

Las contrasenas se almacenarian como hashes seguros y no como texto plano. Esto reduce el impacto de una filtracion de base de datos y mejora el cumplimiento de buenas practicas de seguridad.

### Prioridad

Alta

---

## Hallazgo 2

### Tipo

Vulnerabilidad

### Archivo o modulo afectado

`app.js`

### Descripcion del problema

La configuracion de sesiones usa `process.env.SESSION_SECRET`, pero si la variable no existe utiliza un secreto fijo escrito en el codigo. Esto puede ser detectado por herramientas como SonarQube como una credencial o secreto hardcoded.

### Riesgo si no se corrige

Si el secreto por defecto llega a usarse en un ambiente real, un atacante podria intentar falsificar o manipular cookies de sesion. Ademas, mantener secretos dentro del codigo dificulta la rotacion segura de credenciales.

### Codigo ANTES

```js
app.use(session({
  secret: process.env.SESSION_SECRET || 'educontrol_g3_session_secret',
  resave: false,
  saveUninitialized: false
}));
```

### Codigo DESPUES propuesto

```js
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET no esta configurado.');
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax'
  }
}));
```

### Beneficio del cambio

El sistema obligaria a configurar un secreto desde variables de entorno y evitaria usar valores inseguros por defecto. Tambien mejora la proteccion basica de cookies de sesion.

### Prioridad

Alta

---

## Hallazgo 3

### Tipo

Code Smell

### Archivo o modulo afectado

`controllers/alumnos.controller.js`, `controllers/cursos.controller.js`, `controllers/calificaciones.controller.js`

### Descripcion del problema

Los controladores CRUD repiten estructuras similares para obtener datos del formulario, validar campos, construir mensajes de exito y renderizar vistas con errores. Esta duplicacion aumenta la deuda tecnica y hace que los cambios futuros deban repetirse en varios archivos.

### Riesgo si no se corrige

La aplicacion sera mas dificil de mantener. Si se cambia el formato de errores, los mensajes o la forma de validar datos, existe riesgo de actualizar un modulo y olvidar otro, generando comportamientos inconsistentes.

### Codigo ANTES

```js
const getMessageFromQuery = (query) => {
  const messages = {
    created: 'Alumno registrado correctamente.',
    updated: 'Alumno actualizado correctamente.',
    deleted: 'Alumno eliminado correctamente.'
  };

  return messages[query.success] || null;
};

const validateAlumno = (alumno) => {
  const errors = [];

  if (!alumno.carnet) errors.push('El carnet es obligatorio.');
  if (!alumno.nombre) errors.push('El nombre es obligatorio.');
  if (!alumno.apellido) errors.push('El apellido es obligatorio.');
  if (!alumno.correo) errors.push('El correo es obligatorio.');
  if (!alumno.carrera) errors.push('La carrera es obligatoria.');

  return errors;
};
```

### Codigo DESPUES propuesto

```js
// utils/messages.js
const getCrudMessage = (entityName, status) => {
  const messages = {
    created: `${entityName} registrado correctamente.`,
    updated: `${entityName} actualizado correctamente.`,
    deleted: `${entityName} eliminado correctamente.`
  };

  return messages[status] || null;
};

// utils/validators.js
const validateRequiredFields = (data, fields) => {
  return fields
    .filter((field) => !data[field.name])
    .map((field) => `${field.label} es obligatorio.`);
};
```

### Beneficio del cambio

Centralizar validaciones y mensajes reduce duplicacion, mejora la consistencia entre modulos y facilita cambios futuros. Tambien ayuda a disminuir Code Smells reportados por SonarQube relacionados con codigo duplicado.

### Prioridad

Media

---

## Hallazgo 4

### Tipo

Code Smell

### Archivo o modulo afectado

`models/alumnos.model.js`, `models/cursos.model.js`, `models/reportes.model.js`, `models/dashboard.model.js` y otros modelos.

### Descripcion del problema

Cada funcion de modelo repite la misma estructura: declarar `connection`, abrir conexion con `getConnection()`, ejecutar la consulta y cerrar la conexion en `finally`. Aunque funciona, genera duplicacion y aumenta el volumen de codigo repetitivo.

### Riesgo si no se corrige

El mantenimiento de la capa de datos sera mas costoso. Si se necesita cambiar la forma de manejar conexiones, agregar logs o mejorar errores de base de datos, habra que modificar muchas funciones manualmente, aumentando el riesgo de inconsistencias.

### Codigo ANTES

```js
const getAllAlumnos = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_alumno, carnet, nombre, apellido, correo, telefono, carrera, estado, fecha_registro
       FROM alumnos
       ORDER BY id_alumno DESC`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
```

### Codigo DESPUES propuesto

```js
// utils/dbExecutor.js
const { getConnection } = require('../config/db');

const executeQuery = async (query, params = []) => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(query, params);
    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  executeQuery
};
```

```js
const { executeQuery } = require('../utils/dbExecutor');

const getAllAlumnos = async () => {
  return executeQuery(
    `SELECT id_alumno, carnet, nombre, apellido, correo, telefono, carrera, estado, fecha_registro
     FROM alumnos
     ORDER BY id_alumno DESC`
  );
};
```

### Beneficio del cambio

La capa de modelos quedaria mas limpia, con menos duplicacion y con un punto central para administrar conexiones, logs o errores. Esto reduce deuda tecnica y mejora la mantenibilidad.

### Prioridad

Media

---

## Nota final

Los cambios propuestos en este documento no fueron aplicados al codigo fuente. Se presentan como evidencia y base para el informe final, donde se podra documentar el estado actual del sistema, el impacto del hallazgo y la propuesta de mejora antes de realizar cualquier refactorizacion.
