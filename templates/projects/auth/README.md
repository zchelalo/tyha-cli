# {{name}}
Proyecto creado a partir de tyha-cli.

### Tabla de contenido
- [¿Qué es la arquitectura hexagonal?](#qué-es-la-arquitectura-hexagonal)
  - [¿Por qué usarla?](#por-qué-usarla)
- [¿Cómo ejecutar el proyecto?](#cómo-ejecutar-el-proyecto)
  - [Prerrequisitos](#prerrequisitos)
  - [Variables de entorno](#variables-de-entorno)
  - [Creación de llaves asimétricas](#creación-de-llaves-asimétricas)
  - [Ejecución con Docker](#ejecución-con-docker)
  - [Migraciones](#migraciones)
- [Pruebas](#pruebas)
- [Documentación](#documentación)
  - [Typedoc](#typedoc)

## ¿Qué es la arquitectura hexagonal?
Como su nombre indica, es una arquitectura dividida en hexágonos, más específicamente en tres. A continuación, se presenta un diagrama para facilitar la comprensión:

![Arquitectura Hexagonal](./assets/images/hexagonal_architecture.png)

- **Dominio**. Es el núcleo del hexágono, donde se encuentra toda la lógica de negocio pura. Aquí se definen las entidades, objetos de valor, agregados e interfaces de repositorio. Esta capa solo puede comunicarse consigo misma y no tiene dependencia de ninguna otra capa.
- **Aplicación**. Son los casos de uso, el intermediario que coordina las operaciones entre el dominio y la infraestructura. Aquí se aplican reglas de negocio en respuesta a eventos. Esta capa solo puede comunicarse consigo misma y con el dominio.
- **Infraestructura**. Implementa las interfaces definidas en las capas anteriores. Incluye los adaptadores que interactúan con la base de datos u otros servicios externos. Gestiona la implementación de repositorios, configuraciones u otros aspectos operativos.

El objetivo de usar esta arquitectura es separar responsabilidades. De esta manera, si en el futuro se necesita realizar un cambio, se puede hacer sin tener que rehacer una gran parte de la aplicación.

### ¿Por qué usarla?
Ofrece orden, consistencia y claridad en el código, además de una gran mantenibilidad y escalabilidad del proyecto. Al separar responsabilidades, si en algún momento necesitas cambiar el framework de desarrollo, la base de datos u otro componente, solo tienes que modificar esa parte del módulo. Además, la independencia de las distintas secciones del proyecto facilita la realización de pruebas.

## ¿Cómo ejecutar el proyecto?
### Prerrequisitos
- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [NodeJS](https://nodejs.org/en/download/package-manager)

### Variables de entorno
Para configurar las variables de entorno, ejecuta el script `npm run create:envs` en el archivo package.json. Esto copiará el archivo `.env.example` a `.env`. Si necesitas modificar algo, solo edita el archivo `.env` recién creado.

### Creación de llaves asimétricas
Los certificados para manejar la autenticación, también importantes para a futuro meter funcionalidades como cambio de contraseña. Se crean ejecutando el script `npm run create:certs` en el archivo package.json. Esto creará los archivos .pem necesarios praa que funcione la aplicación.

### Ejecución con Docker
Tras configurar las variables de entorno, ejecuta los contenedores Docker. Los archivos necesarios se encuentran en la carpeta `.dockers`. Ejecuta `npm run compose` para correr el archivo `.dockers/docker-compose.yml` y construir el proyecto. Si es necesario, usa `npm run compose:build` para construirlo explícitamente.

### Migraciones
Para que las migraciones funcionen, `docker compose` debe estar en ejecución, ya que la base de datos debe estar activa.

Las migraciones se manejan con Drizzle. Para generarlas, usa `npm run migration:generate`. Luego, aplícalas con `npm run migration:push`. Para hacerlo en un solo paso, ejecuta `npm run migrate`. Después hacemos el seed para tener los datos que deben existir como los tipos de token o los roles de usuario, eso se hace con `npm run migration:seed`

## Pruebas
Los tests se encuentran en la carpeta `test`, replicando la estructura de los archivos probados, con `.test` agregado al nombre. Para ejecutarlas, usa `npm run test`, lo que cargará las variables de entorno de `.env.test`.

Al ejecutar las pruebas, se creará una carpeta `coverage` en la raíz del proyecto, con dos reportes:
- `test-report.html`: indica si las pruebas pasaron o fallaron.
- `index.html`: muestra cuántas líneas de código están cubiertas por pruebas.

## Documentación
### Typedoc
Genera documentación del código explicando funciones, variables, clases, interfaces, etc. Para generar la documentación, usa `npm run create:docs`. Se creará una carpeta `docs` con el archivo `index.html`.