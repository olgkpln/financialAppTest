const axios = require("axios");
const { GraphQLClient } = require("graphql-request");
const { GRAPHQL_ENDPOINT, SERVER_BASE_URL, TRANSACTION_CATEGORIES, USERNAMES } = require("../consts");

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

    if (startDate !== undefined && validateDateFormat(startDate) === false) {
        throw "wrong date format provided for startDate, use DD/MM/YYYY";
    }

    if (endDate !== undefined && validateDateFormat(endDate) === false) {
        throw "wrong date format provided for endDate, use DD/MM/YYYY";
    }

    let graphqlResponse = null;
    try {
        graphqlResponse = await client.request(getQuery(), {username, startDate, endDate});
    } catch (e) {
        return JSON.stringify({ });
    }
    let report = {};

    let enriched = [];
    for (let t of graphqlResponse.transactions) {
        let description = t.description;
        let amount = t.amount;
        enriched.push(
            getClassification({description: description})
                .then(x => {
                    let classification = x.data.transactionCategory;
                    if (classification === undefined) {
                        classification = "NO_CATEGORY";
                    }
                    if (report[classification] === undefined) {
                        report[classification] = 0;
                    }
                    report[classification] += amount;
                })
                .catch(e => {
                    console.error("error while trying to get classifications", e)
                })
        );
    }

    await Promise.all(enriched);

    return JSON.stringify(report);
}

async function getClassification({ description }) {

  let data = JSON.stringify({ "transactionDescription" : description } );

  let config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  return axios.post("http://localhost:4000/transaction/classification", data, config);
}

function getQuery() {
    return `query GetTransactions($username: String!, $startDate: String, $endDate: String) {
        transactions(username: $username, startDate: $startDate, endDate: $endDate) {
          date
          description
          amount
        }
      }`;
}

function validateDateFormat(date) {
    const reg = /(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d/;
    if (date.match(reg)) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = {
  generateReport
};
