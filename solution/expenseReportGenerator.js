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
  const query =
      `query GetTransactions($username: String!, $startDate: String, $endDate: String) {
        transactions(username: $username, startDate: $startDate, endDate: $endDate) {
          date
          description
          amount
        }
      }`

  const variables = {
    username: username,
    startDate: startDate,
    endDate: endDate
  }

  client.request(query, variables)
  .then(async (data) => {
    for (let t of data.transactions) {
      let r = await (getClassification({description: t.description}));
    }
  })
  .catch((e) => console.log(e));
}

async function getClassification({ description }) {

  var axios = require('axios');
  var data = JSON.stringify({"transactionDescription":"Star taxies"});

  var config = {
    method: 'post',
    url: 'http://localhost:4000/transaction/classification',
    headers: {
      'Content-Type': 'application/json',
    },
    data : data
  };

  axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log("expo replied with error: ", error)
      });


  // var data = JSON.stringify({"transactionDescription":description});
  //
  // var config = {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // };
  // try {
  //   let r = await axios.post('http://localhost:4000/transaction/classification', data, config);
  //   console.log(r.data);
  // } catch (e) {
  //   console.log(e);
  // }
}

module.exports = {
  generateReport
};
