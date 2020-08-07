import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";
import React from "react";
import { NavLink } from "react-router-dom";
import { Formik } from "formik";

const ADD_USER = gql`
  mutation addUser(
    $name: String!
    $lastname: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    addUser(
      name: $name
      lastname: $lastname
      email: $email
      password: $password
      role: $role
    ) {
      id
      name
    }
  }
`;

export function GraphqlRegister() {
  const [addUser] = useMutation(ADD_USER);

  return (
    <div className="container max-width">
      <h1>Hello do you want register?</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
          lastname: "",
          name: "",
          role: "",
        }}
        validate={(values) => {
          var errors = false;
          if (!values) {
            errors = true;
          }
          return errors;
        }}
        onSubmit={(values) => {
          let { name, lastname, email, password, role } = values;
          addUser({ variables: { name, lastname, email, password, role } });
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                name="name"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>LastName</label>
              <input
                type="text"
                name="lastname"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastname}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>email</label>
              <input
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                name="email"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.role}
                type="text"
                name="role"
                className="form-control"
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <NavLink
                to={
                  values.email &&
                  values.password &&
                  values.name &&
                  values.lastname &&
                  values.role
                    ? "/"
                    : "/register"
                }
                type="submit"
                className="btn btn-primary"
              >
                Register
              </NavLink>
              <div>
                <NavLink to="/login">¿Do you have Account?</NavLink>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
