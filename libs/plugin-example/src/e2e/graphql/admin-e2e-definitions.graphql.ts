import gql from 'graphql-tag';

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      emailAddress
    }
  }
`;
