import React from "react";
import { Switch, Route } from "react-router-dom";
import { GraphHome } from "./graphql/GraphqHome";
import { GraphqlRegister } from "./graphql/GraphqlRegister";
import { GraphqLogin } from "./graphql/GraphqLogin";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={GraphHome} />
      <Route path="/login" component={GraphqLogin} />
      <Route path="/register" component={GraphqlRegister} />
    </Switch>
  );
};

export default Routes;
