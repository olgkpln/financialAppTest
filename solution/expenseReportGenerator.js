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
async function generateReport({ username, startDate, endDate }) {
  const query =
      `query GetTransactions($username: String!, $startDate: String, $endDate: String) {
        transactions(username: $username, startDate: $startDate, endDate: $endDate) {
          date
          description
          amount
        }
      }`;

  const variables = {
    username: username,
    startDate: startDate,
    endDate: endDate
  };

  let graphqlResponse = await client.request(query, variables);

  let transactions = graphqlResponse.transactions;

  let grouped = { };

  let enriched = [];
  for (let t of transactions) {
    let description = t.description;
    let amount = t.amount;
    enriched.push(
        {
          classification: getClassification({description: description})
              .then(x => {
                let classification = x.data.transactionCategory;
                if (classification === undefined) {
                  classification = "NO_CATEGORY";
                }
                if (grouped[classification] === undefined) {
                  grouped[classification] = 0;
                }
                grouped[classification] += amount;
              })
        }
    );
  }

  await Promise.all(enriched.map(c => c.classification));

  return JSON.stringify(grouped);

}

async function getClassification({ description }) {

  let data = JSON.stringify({ "transactionDescription" : description } );

  let config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return axios.post('http://localhost:4000/transaction/classification', data, config);
}

module.exports = {
  generateReport
};
