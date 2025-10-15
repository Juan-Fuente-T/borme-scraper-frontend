# Proyecto Procesador del BORME

Aplicación full-stack que extrae, procesa y expone datos de "Constitución de Sociedades" publicados en el **Boletín Oficial del Registro Mercantil (BORME)**.

## Stack Tecnológico

- **Backend**: Groovy, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, Flyway, Jsoup.
- **Frontend**: Svelte 5, TypeScript, Vite, TailwindCSS, Axios.
- **Infraestructura**: Docker, Docker Compose.

## Características Principales

### Extracción Automatizada

- Scraper que descarga los PDFs del BORME para una fecha específica desde [www.boe.es](https://www.boe.es).

### Parseo Inteligente

- Procesa selectivamente los ficheros **BORME-A** (Actos inscritos), ignorando otras secciones e índices.
- Extrae y estructura los datos de los asientos de "Constitución de Sociedades".
- Convierte campos como el capital social a formato numérico para permitir una ordenación precisa.

### API REST Robusta

- Arquitectura en capas (**Controller -> Service -> Repository**) para una máxima separación de responsabilidades.
- Seguridad **STATELESS** implementada con **HTTP Basic Authentication**.
- Endpoints con capacidades avanzadas de búsqueda multi-campo, paginación y ordenación.
- Manejo de errores centralizado a través de un `GlobalExceptionHandler`.

### Frontend Reactivo

- Interfaz de usuario construida con **Svelte 5** y estilizada con **TailwindCSS**.
- Dashboard para iniciar el procesamiento y visualizar los resultados en tiempo real.
- Vistas paginadas para explorar todas las compañías y publicaciones.
- Modal de detalle para cada compañía con un visor de PDF integrado, servido a través de un endpoint proxy en el backend para evitar problemas de CORS/X-Frame-Options.

## Arquitectura

Para un desglose detallado de la arquitectura de la aplicación, el flujo de datos y el esquema de la base de datos, consulte el documento **[ARQUITECTURA.md](ARQUITECTURA.md)**.

## Uso de la Aplicación

La interfaz de usuario se divide en tres secciones principales accesibles desde la barra de navegación superior, además de una página de login. Cuenta con un botón de **Logout** en la barra de navegación para cerrar la sesión.

##### 1. Dashboard (Página Principal)
- Permite seleccionar una fecha y pulsar "Procesar" para iniciar el análisis de los PDFs del BORME de ese día. Se muestra una primera página de resultados, enlaces clicables a los PDFs originales y un botón que permite ver detalles para cada compañia.
- Permite moverse entre las distintas páginas de resultados y ordenación por **Fecha de Constitución** o por **Capital**.
- **Modal de Detalles:** Al hacer clic sobre una de las compañías de la tabla, se abre un modal con su información detallada y el pdf del que se ha extraído.

##### 2. Todas las Compañías
Esta página muestra un directorio completo de **todas** las compañías almacenadas en la base de datos.
- Los resultados se muestran en páginas (30 por página), con controles para navegar entre ellas.
- Permite filtrar por nombre de compañía, administrador/socio, y un rango de fechas de constitución (este último presenta un bug conocido) y ordenación por **Fecha de Constitución** o por **Capital**.
- Cada fila de la tabla es clicable y abre el modal con los detalles completos de la compañía.

##### 3. Todas las Publicaciones
Esta sección muestra un listado paginado de **todos los ficheros PDF** que han sido procesados.
- La lista se puede ordenar por fecha de publicación.
- Cada entrada tiene enlace clicable que abre el PDF original en una nueva pestaña del navegador.

## Prerrequisitos

- **Docker**
- **Docker Compose**

## Despliegue y Ejecución (Recomendado)

## Instalación Rápida (Linux/Ubuntu/Debian)

### Paso 1: Descomprimir el archivo

```bash
unzip lambda-entrega.zip
cd lambda-processor`
```

### Paso 2: Dar permisos a los scripts

```bash
chmod +x start.sh stop.sh clean.sh
```

### Paso 3: Ejecutar el script de inicio desde la raíz del proyecto

```bash
./start.sh
```

Este script:

✅ Verifica que Docker y Docker Compose estén instalados
✅ Instala dependencias (npm install en el contenedor)
✅ Construye las imágenes del backend y frontend
✅ Levanta todos los servicios (PostgreSQL, Backend, Frontend)
✅ Muestra las URLs y credenciales necesarias

### Paso 4: Acceder a la aplicación

    * **Frontend:** `http://localhost:5173`
    * **API Backend:** `http://localhost:8080`

## Autenticación

La API está protegida con **HTTP Basic Authentication**. Para interactuar con los endpoints protegidos (a través de Postman, curl o cualquier otro cliente), utilice las siguientes credenciales:

- **Usuario**: `processor`
- **Contraseña**: `borme-processor`

## Endpoints Principales de la API

**POST** `/api/borme/process`

- **Descripción**: Inicia el procesamiento para una fecha. Parámetro: `date=YYYY-MM-DD`.
- **GET** `/api/borme/companies/all`
  - **Descripción**: Obtiene una lista paginada de todas las compañías.
- **GET** `/api/borme/companies`
  - **Descripción**: Obtiene compañías para una fecha específica. Parámetro: `date=YYYY-MM-DD`.
- **GET** `/api/borme/companies/search`
  - **Descripción**: Búsqueda avanzada con filtros opcionales.
- **GET** `/api/borme/companies/{id}`
  - **Descripción**: Obtiene los detalles de una única compañía por su ID.
- **GET** `/api/borme/publications`
  - **Descripción**: Obtiene una lista paginada de todas las publicaciones (PDFs procesados).
- **GET** `/api/borme/publications/proxy/{id}`
  - **Descripción**: Endpoint proxy para servir el contenido de un PDF.
- **GET** `/api/borme/stats`
  - **Descripción**: Obtiene estadísticas generales de la base de datos.
- **GET** `/api/auth/user`
  - **Descripción**: Endpoint protegido para verificar credenciales de login.
- **GET** `/api/borme/health`
  - **Descripción**: Endpoint público para verificar el estado de la API.

## Parámetros de Paginación y Ordenación

Los endpoints que devuelven listas (`/companies/all`, `/companies`, `/search`, `/publications`) aceptan los siguientes parámetros de URL opcionales:

- `page`: Número de página (ej. `page=0`).
- `size`: Tamaño de la página (ej. `size=20`).
- `sort`: Campo y dirección de ordenación (ej. `sort=startDate,desc` o `sort=capitalNumeric,asc`).

## Ejemplo de Uso Completo

### 1. Procesar BORME de una fecha

curl -u processor:borme-processor \
 -X POST "http://localhost:8080/api/borme/process?date=2025-09-01"

##### Respuesta:

json{
"success": true,
"message": "Procesamiento completado con éxito",
"date": "2025-09-01",
"filesProcessed": 41,
"companiesFound": 1247
}

### 2. Buscar empresas

curl -u processor:borme-processor \
 "http://localhost:8080/api/borme/companies/search?name=TECH&sort=capitalNumeric,desc&page=0&size=10"

### 3. Obtener detalles de una empresa

curl -u processor:borme-processor \
 "http://localhost:8080/api/borme/companies/123"

### 4. Ver publicaciones procesadas

curl -u processor:borme-processor \
 "http://localhost:8080/api/borme/publications?page=0&size=20"


## Comandos Útiles

#### Ver logs en tiempo real

docker-compose logs -f

#### Ver logs solo del backend

docker-compose logs -f backend

#### Ver logs solo del frontend

docker-compose logs -f frontend

#### Detener servicios

./stop.sh

#### o manualmente:

docker-compose down

#### Reiniciar servicios

docker-compose restart

#### Limpiar todo (contenedores, imágenes, volúmenes)

./clean.sh

#### Solución de Problemas

##### Error: "Puerto 5173 ya en uso"

**Identificar proceso**
lsof -ti:5173

**Matar proceso**
kill -9 $(lsof -ti:5173)

##### Error: "Puerto 8080 ya en uso"

**Identificar proceso**
lsof -ti:8080

**Matar proceso**
kill -9 $(lsof -ti:8080)

### Reconstruir desde cero

docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

#### Ver estado de los contenedores

docker-compose ps


## Estructura del Proyecto


borme-processor/
│
├── backend/ # Aplicación Spring Boot (Groovy)
│ ├── src/main/groovy/
│ │ └── com/lambda/borme_processor/
│ │ ├── controller/ # Endpoints REST
│ │ ├── service/ # Lógica de negocio
│ │ ├── repository/ # Acceso a datos
│ │ ├── entity/ # Entidades JPA
│ │ ├── dto/ # Data Transfer Objects
│ │ ├── config/ # Configuración (Security, etc.)
│ │ └── exception/ # Manejo de errores
│ │ └── utils/ # Funciones de apoyo
│ ├── src/main/resources/
│ │ ├── db/migration/ # Scripts Flyway
│ │ └── application\*.properties
│ ├── Dockerfile
│ └── pom.xml
│ └── application-dev.properties
│ └── application-prod.properties
│
├── frontend/ # SPA Svelte
│ ├── src/
│ │ ├── lib/
│ │ │ ├── components/ # Componentes reutilizables
│ │ │ ├── stores.ts # Estado global (Svelte stores)
│ │ │ └── api.ts # Cliente HTTP (Axios)
│ │ └── routes/ # Páginas (SvelteKit)
│ ├── Dockerfile
│ ├── nginx.conf
│ └── package.json
│
├── docker-compose.yml # Orquestación de servicios
├── start.sh # Script de inicio rápido
├── stop.sh # Script de parada
├── clean.sh # Script de limpieza
├── README.md
└── ARQUITECTURA.md

### Componentes Principales del Backend

#### **Capa de Adquisición** (Scraping)

- `BormeScraperService`: Descarga PDFs desde boe.es

#### **Capa de Procesamiento**

- `PdfParsingService`: Extrae texto de PDFs
- `BormeParserService`: Parsea y estructura datos

#### **Capa de Persistencia**

- `PersistenceService`: Gestiona almacenamiento en BD
- `CompanyRepository`, `BormePublicationRepository`: Acceso a datos

#### **Capa de Exposición**

- `BormeController`: API REST
- `AuthController`: Autenticación

#### **Seguridad**

- `SecurityConfig`: HTTP Basic Authentication
- `GlobalExceptionHandler`: Manejo centralizado de errores

## 5️⃣ **MEJORAS OPCIONALES REALIZADAS**

## Mejoras Implementadas

✅ **Autenticación y Autorización**: HTTP Basic Authentication con Spring Security

✅ **Parseo Selectivo**: Extracción de datos con regex, procesando solo ficheros BORME-A relevantes

✅ **Conversión Numérica del Capital**: Parseado a formato numérico para ordenación precisa

✅ **Proxy de PDFs**: Endpoint para servir PDFs evitando problemas de CORS

✅ **Búsqueda Multi-campo**: Filtros combinados con paginación y ordenación


## Mejoras Propuestas y Puntos Conocidos

Esta sección documenta posibles futuras mejoras y problemas conocidos en la versión actual.

### Mejoras de Arquitectura

1.  **Refactorización del Frontend (SvelteKit):** Componentes como `companies/+page.svelte` contienen una cantidad considerable de lógica de estado y de obtención de datos. La práctica recomendada en SvelteKit es mover esta lógica a un fichero `+page.ts` asociado, separando la obtención de datos (que puede ejecutarse en el servidor) de la presentación visual.

2.  **Actualización a Autenticación JWT:** El sistema actual utiliza HTTP Basic Authentication, que es simple y funcional para este prototipo. Una mejora significativa sería migrar a un sistema basado en JSON Web Tokens (JWT).

### Issues Conocidos y Correcciones Pendientes

1.  **BUG: Fallo en el Filtro por Rango de Fechas:** La funcionalidad de búsqueda en la página "Todas las Compañías" actualmente presenta un error al intentar filtrar por un rango de fechas (`Desde` / `Hasta`). El backend no está interpretando correctamente estos parámetros, lo que impide que la búsqueda funcione como se espera.

2.  **Mejora en la Ordenación (Manejo de Nulos):** Al ordenar los resultados en modo ascendente se sitúan los registros `NULL` al principio de la lista. La experiencia de usuario mejoraría si estos registros se mostraran siempre al final.

3.  **Optimización de Rendimiento:** El proceso de scraping y parsing es lento, especialmente para días con un gran número de publicaciones. Se podrían investigar optimizaciones como el procesamiento en paralelo de los ficheros PDF o la mejora de las expresiones regulares para acelerar la extracción de datos.
