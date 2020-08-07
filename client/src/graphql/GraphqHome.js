import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";
import { NavLink } from "react-router-dom";

const GET_USERS = gql`
  query getUsers {
    users {
      id
      name
      lastname
      email
      role
    }
  }
`;

const REMOVE_USER = gql`
  mutation removeUser($input: String!) {
    removeUser(id: $input) {
      id
      name
      lastname
      email
      role
    }
  }
`;

export function GraphHome() {
  const { loading: queryLoading, error: queryError, data } = useQuery(
    GET_USERS
  );

  const [removeUser] = useMutation(REMOVE_USER);

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error {":("}</p>;

  function deleteUser(id) {
    removeUser({ variables: { id } });
  }
  function logOut() {
    localStorage.removeItem("session");
  }
  return (
    <>
      <h1>
        Delete an create Users{" "}
        <NavLink to="/login" onClick={logOut} className="btn btn-warning">
          Cerrar sesion
        </NavLink>
        <NavLink to="/register" className="btn btn-success">
          Crear Usuario
        </NavLink>
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Actions</th>
            <th scope="col">Name</th>
            <th scope="col">LastName</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index}</th>
              <td>{item.name}</td>
              <td>{item.lastname}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>
                <button
                  onClick={deleteUser}
                  className="btn btn-danger left-space"
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
