const axios = require('axios');
const { GraphQLClient } = require('graphql-request');
const { GRAPHQL_ENDPOINT, SERVER_BASE_URL, TRANSACTION_CATEGORIES, USERNAMES } = require('../consts');

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

/**
 * Generates a report object containing the total spending of the given user in the given date range.
 * The report object's keys are all the transaction categories, and the values are the total spending
 * in each category.
 *
 * @param username             The username for which to generate the report (the USERNAMES const contains the possible usernames).
 * @param startDate (optional) Limit the transactions the report takes into account to ones that happened on or after the given startDate.
 *                             Date format is `DD/MM/YYYY` (for example `01/10/2017` or `15/08/2018`)
 * @param endDate   (optional) Limit the transactions the report takes into account to ones that happened on or before the given endDate.
 *                             Date format is `DD/MM/YYYY` (for example `01/10/2017` or `15/08/2018`)
 * @returns Promise            Example return value:
 *
 *                                {
 *                                   EATING_OUT: 4325,
 *                                   GROCERIES: 0,
 *                                   VACATION: 228,
 *                                   MEDICAL: 780,
 *                                   PUBLIC_TRANSPORTATION: 0,
 *                                   CAR_MAINTENANCE: 2000,
 *                                   SAVINGS: 350,
 *                                   BILLS: 0,
 *                                   ENTERTAINMENT: 0
 *                                }
 */
function generateReport({ username, startDate, endDate }) {
  // TODO your solution starts here
  // to run a graphql query you can use the graphql client as follows: client.request(YOUR_QUERY, QUERY_VARIABLES);
}

module.exports = {
  generateReport
};
