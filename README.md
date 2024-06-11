# Descripción:
El backend del e-commerce está diseñado para gestionar productos, usuarios, pedidos y pagos. Utiliza una combinación de librerías y frameworks para manejar autenticación, seguridad, almacenamiento de datos, y la comunicación en tiempo real, entre otras funcionalidades.

**Características Principales**:
- **Autenticación y Autorización**: Utiliza Passport con estrategias de JWT, GitHub y local para la autenticación de usuarios.
- **Gestión de Productos y Usuarios**: CRUD completo para productos y usuarios utilizando Mongoose.
- **Sesiones y Cookies**: Manejo de sesiones con `express-session` y almacenamiento en MongoDB con `connect-mongo`.
- **Subida de Archivos**: Gestión de archivos subidos por los usuarios utilizando Multer.
- **Comunicación en Tiempo Real**: Integración con Socket.io para actualizaciones en tiempo real.
- **Seguridad**: Hashing de contraseñas con bcrypt y generación de tokens JWT para la autenticación segura.
- **Documentación API**: Documentación automática de la API con Swagger.
- **Logging y Manejo de Errores**: Implementación de Winston para el registro de logs y manejo de errores.

## Proyecto Node.js

Este proyecto utiliza Node.js y varias dependencias para proporcionar una aplicación completa. A continuación, se detallan los pasos necesarios para configurar y ejecutar el proyecto.

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

1. **Node.js**: Puedes descargar la última versión de Node.js desde [nodejs.org](https://nodejs.org/).
2. **npm**: npm se instala automáticamente con Node.js. Verifica la instalación ejecutando:
    ```sh
    node -v
    npm -v
    ```

#### Instalación de Node.js

**En Windows/MacOS**

1. Ve a [nodejs.org](https://nodejs.org/).
2. Descarga el instalador de la versión LTS (Long Term Support).
3. Ejecuta el instalador y sigue las instrucciones.

**En Linux**

Usa el siguiente comando para instalar Node.js desde el repositorio oficial de NodeSource:

```sh
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verifica la instalación:**
```sh
node -v
npm -v
```

**Inicializa un nuevo proyecto de Node.js:**
```sh
npm init -y
```

##### Instalación de Dependencias
Agrega las siguientes dependencias a tu proyecto utilizando:
```sh
npm install @faker-js/faker@8.3.1 bcrypt@5.1.1 commander@11.1.0 connect-mongo@5.1.0 cookie-parser@1.4.6 dotenv@16.3.1 express@4.18.2 express-handlebars@7.1.2 express-session@1.17.3 jsonwebtoken@9.0.2 luxon@3.4.4 mongoose@8.0.0 mongoose-paginate-v2@1.7.4 multer@1.4.5-lts.1 nodemailer@6.9.8 passport@0.7.0 passport-github2@0.1.12 passport-jwt@4.0.1 passport-local@1.0.0 socket.io@4.7.2 swagger-jsdoc@6.2.8 swagger-ui-express@5.0.0 uuid@9.0.1 winston@3.11.0 zod@3.22.4
```
**Resumen de Dependencias:**

@faker-js/faker: Generador de datos falsos.
bcrypt: Librería para el hashing de contraseñas.
commander: Librería para crear interfaces de línea de comandos.
connect-mongo: Almacén de sesiones para Express usando MongoDB.
cookie-parser: Middleware para el manejo de cookies.
dotenv: Carga variables de entorno desde un archivo .env.
express: Framework de aplicación web.
express-handlebars: Motor de plantillas para Express.
express-session: Middleware para la gestión de sesiones.
jsonwebtoken: Implementación de JSON Web Tokens.
luxon: Librería para la manipulación de fechas y horas.
mongoose: ODM para MongoDB.
mongoose-paginate-v2: Plugin de paginación para Mongoose.
multer: Middleware para el manejo de multipart/form-data.
nodemailer: Librería para enviar correos electrónicos.
passport: Middleware de autenticación.
passport-github2: Estrategia de autenticación con GitHub.
passport-jwt: Estrategia de autenticación con JSON Web Tokens.
passport-local: Estrategia de autenticación local.
socket.io: Librería para la comunicación en tiempo real.
swagger-jsdoc: Generador de documentación OpenAPI.
swagger-ui-express: Middleware para servir la documentación Swagger.
uuid: Generador de identificadores únicos.
winston: Librería de logging.
zod: Librería para la validación de datos.

# Observaciones
**En el caso de que usted ya tenga instalado node y haya descargado este repositorio de** **manera completa, no es necesario realizar los pasos anteriores.**
**Solo debe posicionarse en la ruta main de el proyecto y utilizar el siguiente comando:**
```sh
node app.js
```
