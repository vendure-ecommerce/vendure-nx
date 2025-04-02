import gql from 'graphql-tag';

export const GET_CURRENT_CUSTOMER = gql`
  query GetCurrentCustomer {
    activeCustomer {
      id
      emailAddress
    }
  }
`;
