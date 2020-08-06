const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const Express = require("express");
const ExpressGraphQL = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");

const app = Express();
const cors = require("cors");

app.use(cors());

const UserSchema = require('./lib/schemas/user');

app.use('*', cors());
app.use('/graphql', ExpressGraphQL({
  schema: UserSchema,
  graphiql: true,
}));

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`).then(() => {
  console.log('Connection with MongoDB is successfully');
  app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Server runing correctly in http://${process.env.HOST}:${process.env.PORT}`);
  })
})
.catch(err => console.log(err));
