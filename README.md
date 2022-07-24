# nestjs-api-boilerplate

Built with NestJS and TypeScript

1. clone the repo `git clone https://github.com/Tope19/nestjs-api-boilerplate.git`
2. cd into the project root folder
3. To install the dependencies run `npm install`
4. run `npm run build` to create a production build.
5. Run the server in development mode `npm run start:dev`.
6. Run the server in producttion mode `npm run start:prod`.
7. Create a Database Migration file `npm run typeorm migration:create ./src/database/migration/${file name}`.
8. To Generate a Database Migration File from your Entity Schema `npm run typeorm migration:generate ./src/database/migration/${file name}`.
9. Revert a Database Migrattion file `npm run typeorm migration:revert`
10. Migrate the database `npm run typeorm migration:run`
11. Swagger Api Doc Url `localhost:3000/api-doc`

# Some Features of the Application

1. You may save the hassle of setting up Swagger on your Application because this Application already has Inbuilt SwaggerAPi.

2. It includes a CRUD example to let you design your own for each entity, guard, service, controller, etc.

3. You only need to copy the env.example file and change it with your  information and chosen TypeOrm DB Connection because TypeOrm Config is already configured by default to use POSTGRESQL.

4. The application also makes an effort to adhere to best practices for code structure and will continually be enhanced to ensure code readability.

5. The upcoming version will include full authentication procedures, which will help to cut down on development time.

***
### You are more than welcome to contribute to the application!

