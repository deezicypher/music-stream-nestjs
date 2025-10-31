export default () => ({
port: parseInt(process.env.PORT || '3000', 10),
node_env: process.env.NODE_ENV,
secret: process.env.SECRET,
db_username:process.env.DB_USERNAME,
db_password:process.env.DB_PASSWORD,
db_host:process.env.DB_HOST,
db_port:process.env.DB_PORT,
db_name:process.env.DB_NAME
});