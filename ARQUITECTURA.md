## Arquitectura y Flujo de Datos

Este documento describe la arquitectura de alto nivel y los flujos de datos principales del **Proyecto Procesador del BORME**.

### 1. Diagrama de Arquitectura de Alto Nivel

El sistema está diseñado siguiendo una arquitectura en capas, completamente contenida dentro de un entorno Docker para asegurar la portabilidad y consistencia.

<image-card alt="Esquema de la Base de Datos" src="images/DiagramaFlujoBorme.png" ></image-card>

#### Flujo General:

* El Usuario interactúa con la aplicación Svelte en su navegador.

* El frontend realiza llamadas a la API REST expuesta por el backend de Spring Boot.

* La Capa de Controlador recibe las peticiones, las valida y las delega al Servicio de Negocio (BormeProcessorService).

* El BormeProcessorService orquesta a los Servicios Especializados para realizar tareas concretas (scraping, parsing, persistencia).

* La Capa de Repositorio (gestionada por Spring Data JPA) traduce las operaciones de datos en consultas SQL y se comunica con la base de datos PostgreSQL.

* El BormeScraperService se conecta al Sitio Web del BOE para descargar los ficheros PDF necesarios.

### 2. Diagrama de Flujo: Procesamiento de un Día (POST /process)

Este diagrama detalla la secuencia de operaciones cuando se solicita el procesamiento de una nueva fecha.

<image-card alt="Esquema de la Base de Datos" src="images/DiagramaProceso.png" ></image-card>

### 3. Esquema Básico de la Base de Datos

La persistencia se basa en dos tablas principales con una relación de uno a muchos:

- **borme_publications**: Almacena un registro por cada fichero PDF que ha sido procesado. Contiene metadatos como la fecha de publicación, el nombre del fichero y la URL pública.
- **companies**: Almacena un registro por cada "Constitución de Sociedad" extraída. Cada compañía está vinculada a una única `borme_publications` a través de la clave foránea `publication_id`.

<image-card alt="Esquema de la Base de Datos" src="images/Database.png" ></image-card>