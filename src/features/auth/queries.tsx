import { gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation login($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
    }
  }
`;

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
    }
  }
`;

export { LOGIN_MUTATION, GET_USER };
