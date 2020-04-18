
#### Personal server boilerplate with NodeJS, KoaJS and Sequelize.


##### Specifications

- NodeJS v10
- [KoaJS](https://koajs.com/)
- [Sequelize](https://sequelize.org/v5/)
- JWT Setup with [passport.js](http://www.passportjs.org/) and cookies with [koa-session](https://github.com/koajs/session) (use whatever is needed)
- Logging with koa-logger and Routing already setup.
- Linting with es-lint and pre-commit hook with husky.
- Bcrypt for generating hash for passwords.

##### Setup instructions

- Needs a `config.json` for database configuration for dev, test and production environments.
- Needs environment files for bcrypt, jwt, etc. (Configured with [dotenv](https://github.com/motdotla/dotenv))
