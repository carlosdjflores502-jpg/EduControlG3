# Informe Final del Proyecto

## Caratula

**Universidad:** Universidad Mariano Galvez de Guatemala  
**Curso:** Ingenieria de Software  
**Proyecto Final:** Implementacion y Mantenimiento de Software con SonarQube  
**Sistema:** EduControl G3 - Sistema de Control Academico  
**Equipo:** Grupo 3  
**Integrantes:**  
- Nombre del integrante 1: ______________________________  
- Nombre del integrante 2: ______________________________  
- Nombre del integrante 3: ______________________________  
- Nombre del integrante 4: ______________________________  
- Nombre del integrante 5: ______________________________  

**Fecha:** ______________________________

---

## 1. Introduccion

El mantenimiento de software es una etapa fundamental dentro del ciclo de vida de una aplicacion, ya que permite conservar, mejorar y adaptar un sistema despues de su desarrollo inicial. A traves del mantenimiento se identifican errores, vulnerabilidades, problemas de diseno, deuda tecnica y oportunidades de mejora que influyen directamente en la calidad del producto.

El presente proyecto tiene como objetivo implementar un sistema de control academico llamado EduControl G3 y prepararlo para un proceso de analisis estatico con SonarQube o SonarCloud. Este analisis permite evaluar la calidad del codigo fuente, documentar hallazgos importantes y proponer mejoras de refactorizacion sin alterar inicialmente la funcionalidad existente.

---

## 2. Objetivos

### Objetivo general

Desarrollar e implementar un sistema web de control academico utilizando arquitectura MVC, base de datos MySQL y tecnologias web, preparando el proyecto para su analisis estatico mediante SonarQube o SonarCloud con el fin de documentar hallazgos de mantenimiento de software.

### Objetivos especificos

1. Implementar los modulos principales del sistema EduControl G3: autenticacion, dashboard, alumnos, cursos, inscripciones, calificaciones y reportes.
2. Configurar el proyecto para permitir un analisis estatico de calidad, seguridad y mantenibilidad mediante SonarQube o SonarCloud.
3. Documentar hallazgos criticos o importantes relacionados con Bugs, Vulnerabilidades, Code Smells y deuda tecnica, proponiendo mejoras sin aplicarlas inicialmente al codigo fuente.

---

## 3. Descripcion del sistema

EduControl G3 es un Sistema de Control Academico desarrollado para administrar informacion relacionada con estudiantes, cursos, inscripciones y calificaciones. El sistema busca resolver la necesidad de centralizar procesos academicos basicos que normalmente se gestionan de forma manual o dispersa.

La aplicacion permite registrar alumnos, crear cursos, inscribir alumnos en cursos, asignar calificaciones y consultar reportes academicos. Ademas, cuenta con autenticacion mediante login y manejo de sesiones, lo cual permite restringir el acceso a las rutas internas del sistema.

---

## 4. Tecnologias utilizadas

- **Node.js:** entorno de ejecucion para JavaScript del lado del servidor.
- **Express:** framework web utilizado para definir rutas, controladores y middleware.
- **MySQL:** sistema gestor de base de datos relacional.
- **EJS:** motor de plantillas usado para generar vistas dinamicas.
- **Bootstrap 5:** framework CSS utilizado para el diseno visual y responsivo.
- **SonarQube o SonarCloud:** herramienta de analisis estatico para evaluar calidad, seguridad y mantenibilidad.
- **Visual Studio Code:** editor utilizado para el desarrollo del proyecto.

---

## 5. Funcionalidad del sistema

### Login

Permite iniciar sesion mediante correo y contrasena. El sistema valida que el usuario exista, que la contrasena coincida y que el estado del usuario sea Activo. Las rutas internas se encuentran protegidas mediante sesiones.

### Dashboard

Muestra informacion general del sistema mediante tarjetas con conteos reales obtenidos desde MySQL: total de alumnos, cursos, inscripciones y calificaciones.

### Alumnos

Modulo CRUD para administrar alumnos. Permite listar, crear, editar y eliminar registros, ademas de visualizar el estado Activo o Inactivo.

### Cursos

Modulo CRUD para administrar cursos. Permite registrar codigo, nombre, descripcion, creditos, catedratico, horario y estado.

### Inscripciones

Modulo que permite inscribir alumnos activos en cursos activos. Incluye validacion para evitar que el mismo alumno sea inscrito dos veces en el mismo curso.

### Calificaciones

Modulo que permite registrar notas de alumnos inscritos. Calcula automaticamente el promedio y define el resultado como Aprobado o Reprobado.

### Reportes

Modulo de reportes basicos que muestra resumen de alumnos por curso, calificaciones por curso y resumen general de aprobados, reprobados y promedio general.

---

## 6. Base de datos

La base de datos utilizada por el sistema se llama `educontrol_g3` y contiene las siguientes tablas principales:

### usuarios

Almacena los usuarios que pueden ingresar al sistema. Contiene nombre, correo, contrasena, rol, estado y fecha de creacion.

### alumnos

Registra la informacion academica y personal de los estudiantes, incluyendo carnet, nombre, apellido, correo, telefono, carrera, estado y fecha de registro.

### cursos

Contiene los cursos disponibles en el sistema, con campos como codigo, nombre, descripcion, creditos, catedratico, horario y estado.

### inscripciones

Relaciona alumnos con cursos. Permite controlar la fecha de inscripcion y el estado de la misma: Activa, Cancelada o Finalizada.

### calificaciones

Registra las notas asociadas a una inscripcion, incluyendo nota parcial, nota final, promedio, resultado, observaciones y fecha de registro.

---

## 7. Analisis estatico con SonarQube

SonarQube es una herramienta de analisis estatico que permite evaluar codigo fuente para detectar problemas de calidad, seguridad y mantenibilidad. Su uso facilita identificar puntos criticos en una aplicacion antes de que se conviertan en fallos mayores o deuda tecnica dificil de corregir.

En EduControl G3, SonarQube o SonarCloud se utilizara para analizar los siguientes tipos de hallazgos:

- **Bugs:** errores potenciales que pueden afectar el funcionamiento del sistema.
- **Vulnerabilidades:** riesgos de seguridad que podrian ser explotados.
- **Code Smells:** problemas de estructura, duplicacion o estilo que afectan la mantenibilidad.
- **Deuda tecnica:** esfuerzo estimado necesario para corregir problemas detectados.

El proyecto cuenta con el archivo `sonar-project.properties`, el cual contiene la configuracion basica para ejecutar el analisis estatico posteriormente.

---

## 8. Hallazgos criticos documentados

A partir de la revision del codigo actual, se documentaron los siguientes hallazgos importantes en `docs/hallazgos-sonarqube.md`:

1. **Contrasenas en texto plano:** el login compara la contrasena ingresada directamente contra el valor almacenado en la tabla `usuarios`.
2. **Secreto de sesion hardcoded:** la configuracion de sesiones permite utilizar un valor por defecto escrito en el codigo si no existe `SESSION_SECRET`.
3. **Codigo repetido en controladores CRUD:** varios controladores repiten estructuras de validacion, mensajes y renderizado de errores.
4. **Manejo repetido de conexion MySQL en modelos:** cada modelo abre y cierra conexiones con una estructura repetida.

Estos hallazgos no fueron corregidos en esta fase. Se documentan como propuestas para una futura refactorizacion y para cumplir con el requerimiento de evidenciar el antes y despues.

---

## 9. Antes y despues de hallazgos

| Hallazgo | Tipo | Antes | Despues propuesto | Beneficio |
| --- | --- | --- | --- | --- |
| Contrasenas en texto plano | Vulnerabilidad | Comparacion directa `usuario.password !== password`. | Usar `bcrypt.compare()` y almacenar hashes de contrasenas. | Mejora la seguridad y reduce el impacto ante filtracion de datos. |
| Secreto de sesion hardcoded | Vulnerabilidad | Uso de `process.env.SESSION_SECRET || 'educontrol_g3_session_secret'`. | Exigir `SESSION_SECRET` desde variables de entorno y configurar cookies seguras. | Evita secretos en codigo y fortalece el manejo de sesiones. |
| Codigo repetido en controladores CRUD | Code Smell | Validaciones y mensajes repetidos en varios controladores. | Crear utilidades reutilizables para mensajes y validaciones. | Reduce duplicacion y facilita mantenimiento. |
| Manejo repetido de conexion MySQL | Code Smell | Cada funcion de modelo abre y cierra conexion manualmente. | Crear un ejecutor central de consultas o helper de base de datos. | Disminuye deuda tecnica y centraliza el manejo de conexiones. |

---

## 10. Conclusiones

1. EduControl G3 cumple con los modulos principales de un sistema academico basico, permitiendo administrar alumnos, cursos, inscripciones, calificaciones y reportes.
2. La aplicacion utiliza una arquitectura MVC que facilita separar responsabilidades entre rutas, controladores, modelos y vistas.
3. La preparacion para SonarQube permite identificar oportunidades de mejora relacionadas con seguridad, mantenibilidad y deuda tecnica.
4. Los hallazgos documentados evidencian que un sistema funcional aun puede requerir mejoras importantes antes de considerarse listo para un ambiente real.

---

## 11. Recomendaciones

1. Implementar cifrado de contrasenas con `bcrypt` antes de utilizar el sistema en un entorno real.
2. Eliminar secretos por defecto en el codigo y exigir variables de entorno seguras para configuraciones sensibles.
3. Refactorizar validaciones, mensajes y manejo de conexiones para reducir duplicacion y mejorar mantenibilidad.
4. Ejecutar SonarQube o SonarCloud y capturar evidencia de Bugs, Vulnerabilidades, Code Smells y deuda tecnica para el informe final.

---

## 12. Referencias

IEEE Computer Society. (2014). *SWEBOK: Guide to the Software Engineering Body of Knowledge* (Version 3.0). IEEE Computer Society.

OpenJS Foundation. (s. f.). *Node.js documentation*. https://nodejs.org/en/docs

OpenJS Foundation. (s. f.). *Express - Node.js web application framework*. https://expressjs.com/

SonarSource. (s. f.). *SonarQube documentation*. https://docs.sonarsource.com/sonarqube/

SonarSource. (s. f.). *SonarCloud documentation*. https://docs.sonarsource.com/sonarcloud/
