import gql from 'graphql-tag';

/**
 * This file contains the GraphQL queries used in the e2e tests.
 * Add any new queries here!
 */

export const GET_CURRENT_CUSTOMER = gql`
  query GetCurrentCustomer {
    activeCustomer {
      id
      emailAddress
    }
  }`;
