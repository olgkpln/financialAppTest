const { generateReport } = require('./expenseReportGenerator');

describe("generateReport tests", () => {
  test('should ...', () => {
    expect(generateReport( { username: "moshe", startDate: "04/01/2017", endDate: "04/01/2017" } )).toEqual("");
  });
});
