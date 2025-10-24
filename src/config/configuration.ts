export default () => ({
port: parseInt(process.env.PORT || '3000', 10),
secret: process.env.SECRET,
db_username:process.env.DB_USERNAME,
db_password:process.env.DB_PASSWORD,
db_host:process.env.DB_HOST,
db_port:process.env.DB_PORT,
db_database:process.env.DB_DATABASE
});