# EduControl G3

Sistema de Control Academico para el Grupo 3.

Proyecto desarrollado para el curso de Mantenimiento de Software.

## Tecnologias iniciales

- Node.js
- Express
- EJS
- Bootstrap 5
- Arquitectura MVC

## Alcance actual

Esta version contiene una aplicacion MVC funcional con:

- Conexion a base de datos MySQL
- Login con sesiones y roles
- Dashboard con datos reales
- CRUD de alumnos
- CRUD de cursos
- CRUD de inscripciones
- CRUD de calificaciones
- Reportes academicos basicos

## Ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Iniciar la aplicacion:

```bash
npm start
```

Abrir en el navegador:

```text
http://localhost:3000
```

## Analisis Estatico con SonarQube

SonarQube es una herramienta de analisis estatico que revisa el codigo fuente para identificar problemas de calidad, seguridad y mantenibilidad sin ejecutar manualmente cada flujo del sistema.

En EduControl G3 se analizara el codigo del proyecto Node.js, Express, EJS y la estructura MVC. El objetivo sera identificar:

- Bugs: errores potenciales que pueden provocar fallos en ejecucion.
- Vulnerabilidades: riesgos de seguridad que podrian afectar la aplicacion.
- Code Smells: practicas de codigo que dificultan mantenimiento o evolucion.
- Deuda tecnica: esfuerzo estimado para corregir problemas de calidad.

El analisis servira para documentar hallazgos criticos del proyecto. Mas adelante, la refactorizacion de al menos tres hallazgos se documentara como antes y despues.

Actualización para nuevo análisis de SonarCloud.
