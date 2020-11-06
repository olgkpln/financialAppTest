const { generateReport } = require("./expenseReportGenerator");

describe("generateReport tests", () => {

  test("basic query for moshe with start and end dates", async () => {
    expect(await generateReport( { username: "moshe", startDate: "04/01/2017", endDate: "04/01/2017" } )).toEqual(JSON.stringify({ PUBLIC_TRANSPORTATION : 72 }));
  });

  test("basic query from david with start and end dates", async () => {
    expect(await generateReport( { username: "david", startDate: "10/10/2017", endDate: "10/10/2017" } )).toEqual(JSON.stringify({ PUBLIC_TRANSPORTATION : 302 }));
  });

  test("no end data", async () => {
    let report = JSON.parse(await generateReport( { username: "moshe", startDate: "04/01/2017" } ));
    expect(report["PUBLIC_TRANSPORTATION"]).toEqual(4491);
    expect(report["EATING_OUT"]).toEqual(5675);
    expect(report["CAR_MAINTENANCE"]).toEqual(1714);
    expect(report["BILLS"]).toEqual(2293);
    expect(report["VACATION"]).toEqual(4434);
    expect(report["MEDICAL"]).toEqual(648);
    expect(report["NO_CATEGORY"]).toEqual(275);
  });

  test("no dates limitations", async () => {
    let report = JSON.parse(await generateReport( { username: "moshe" } ));
    expect(report["PUBLIC_TRANSPORTATION"]).toEqual(4491);
    expect(report["EATING_OUT"]).toEqual(5675);
    expect(report["CAR_MAINTENANCE"]).toEqual(1714);
    expect(report["BILLS"]).toEqual(2293);
    expect(report["VACATION"]).toEqual(4434);
    expect(report["MEDICAL"]).toEqual(648);
    expect(report["NO_CATEGORY"]).toEqual(275);
  });

  test("missing user", async () => {
    expect(await generateReport( { username: "oleg", startDate: "04/01/2017", endDate: "04/01/2017" } )).toEqual(JSON.stringify({ } ));
  });

  test("not providing user", async () => {
    expect(await generateReport( { startDate: "04/01/2017", endDate: "04/01/2017" } )).toEqual(JSON.stringify({ } ));
  });

  it("wrong date format", async () => {
    try { await generateReport( { username: "moshe", startDate: "04.01.2017", endDate: "04.01.2017" } ) } catch (e) { expect(e).toEqual("wrong date format provided for startDate, use DD/MM/YYYY") };
  });

});


