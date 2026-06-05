# Analisis Estatico con SonarQube

## Objetivo del analisis

Evaluar la calidad, seguridad y mantenibilidad del codigo fuente de EduControl G3 mediante analisis estatico. El resultado permitira identificar hallazgos criticos que posteriormente seran documentados y refactorizados como parte del proyecto de Mantenimiento de Software.

## Herramienta usada

La herramienta prevista para el analisis es SonarQube o SonarCloud.

## Pasos generales para ejecutar el analisis

1. Verificar que el proyecto tenga el archivo `sonar-project.properties` en la raiz.
2. Configurar un servidor de SonarQube local o un proyecto en SonarCloud.
3. Instalar o preparar SonarScanner segun la herramienta seleccionada.
4. Ejecutar el analisis desde la raiz del proyecto.
5. Revisar el dashboard generado por SonarQube o SonarCloud.
6. Documentar los hallazgos principales para el informe.

## Tipos de hallazgos esperados

- Bugs: posibles errores funcionales o comportamientos inesperados.
- Vulnerabilidades: problemas de seguridad detectados por la herramienta.
- Code Smells: aspectos del codigo que pueden dificultar mantenimiento.
- Deuda tecnica: tiempo estimado para corregir problemas de calidad.
- Duplicaciones o complejidad: codigo repetido o estructuras dificiles de mantener.

## Evidencia para el informe

Para documentar el analisis se deberan capturar las siguientes evidencias:

- Captura del dashboard de SonarQube.
- Captura de Bugs.
- Captura de Vulnerabilidades.
- Captura de Code Smells.
- Captura de Deuda Tecnica.

## Uso posterior

Los hallazgos criticos identificados serviran para seleccionar al menos tres problemas importantes. La correccion de esos hallazgos se documentara comparando el estado antes y despues de la refactorizacion.
