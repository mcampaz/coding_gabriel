import React from "react";
import { NavLink, Redirect } from "react-router-dom";
import { gql } from "apollo-boost";
import { Formik } from "formik";
import { useMutation } from "react-apollo";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      name
      lastname
      email
      role
    }
  }
`;

export function GraphqLogin() {
  const [valid, setValid] = React.useState(false);
  const [
    login,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(LOGIN);
  return (
    <div className="container max-width">
      <h1>Login to your account</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, e) => {
          let { email, password } = values;
          login({ variables: { email, password } });
          if (mutationError) {
            localStorage.setItem("session", true);
            setValid(true);
          } else if (!mutationError) {
            e.setSubmitting(false);
          }
        }}
        validate={(values) => {
          const errors = [];
          if (!values.email) {
            errors.email = "required";
          } else if (!values.password) {
            errors.password = "required";
          }
          return errors;
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          errors,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password && "is-invalid"}`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                disabled={isSubmitting ? true : false}
                type="submit"
                className="btn btn-primary"
              >
                {valid && <Redirect to="/" />}
                Login
              </button>
              <div>
                <NavLink to="/register">Create new account</NavLink>
              </div>
            </div>
          </form>
        )}
      </Formik>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error {":("} Please try again</p>}
    </div>
  );
}
