import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

let cliente = new ApolloClient({
  uri: "http://localhost:3001/graphql",
});

let WithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

let WithApollo = () => (
  <ApolloProvider client={cliente}>
    <WithRouter />
  </ApolloProvider>
);

ReactDOM.render(
  <WithApollo>
    <App />
  </WithApollo>,
  document.getElementById("root")
);
