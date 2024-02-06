## Generate Model 
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string, password:string

## Migration
sequelize db:migrate

## Generate Module
nest generate module users

## Generate Service
nest generate service users

## Generate Controller
nest generate controller users