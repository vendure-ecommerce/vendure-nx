import gql from 'graphql-tag';

/**
 * This file contains the GraphQL queries used in the e2e tests.
 * Add any new queries here!
 */

export const GET_CUSTOMER = gql`
    query GetCustomer($id: ID!) {
        customer(id: $id) {
            id
            emailAddress
        }
    }
`;
