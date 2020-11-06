const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");

const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");
const { classifyTransaction } = require("./transactionClassifier");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    console.log(error);
    delete error.extensions.exception;
    return error;
  },
});

const app = express();
server.applyMiddleware({ app });
app.use(bodyParser.json());

app.post("/transaction/classification", async function(req, res) {
  if (!req.body || !req.body.transactionDescription) {
    res.status(400);
    res.send({
      error:
        "Invalid request: body should be a json with a single property: transactionDescription"
    });
    return;
  }

  const { transactionDescription } = req.body;
  const transactionCategory = await classifyTransaction(transactionDescription);
  res.send({
    transactionCategory
  });
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

module.exports = {
  apolloServer: server
};
