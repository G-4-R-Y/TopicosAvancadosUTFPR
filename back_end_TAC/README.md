npm i -g express-generator
npm i nodemon --save-dev

npm i
prepare .sequelizerc:
```
const path = require('path');

module.exports = {
    config: path.resolve('./database/config', 'config.json'),
    'models-path': path.resolve('./database/models'),
    'seeders-path': path.resolve('./database/seeders'),
    'migration-path': path.resolve('./database/migrations'),
}
```
sequelize init (cria seeds etc)
sequelize db:migrate (executar alteraçoes na tabela)