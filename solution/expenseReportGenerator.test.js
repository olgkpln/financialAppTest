const { generateReport } = require('./expenseReportGenerator');

describe("generateReport tests", () => {
  test('should ...', async () => {
    expect(await generateReport( { username: "moshe", startDate: "04/01/2017", endDate: "04/01/2017" } )).toEqual(JSON.stringify({ PUBLIC_TRANSPORTATION : 72 }));
  });
});
