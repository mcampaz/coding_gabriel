import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";

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

export default function ButtonDelete({ currentId }) {
  const [removeUser] = useMutation(REMOVE_USER);

  function delteUserF(currentId) {
    removeUser({ variables: { id: currentId } });
  }

  return (
    <div>
      <button
        onClick={delteUserF(currentId)}
        className="btn btn-danger left-space"
      >
        delete
      </button>
    </div>
  );
}
