var colors = require("colors");
const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:root@192.168.0.28:5432/headstocks");
var MongoClient = require("mongodb").MongoClient;
const stocksData = require("./models/stocksModel");
let tickerNames = [];

main();
async function main() {
  await insertOHLC_Data();
}

async function insertOHLC_Data() {
  const tickerQuery = `select distinct(ticker) from yahoodata where isindex=false order by ticker`;
  let tickerNameResult = await db.any(tickerQuery);
  tickerNameResult.forEach(async current_ticker => {
    // console.log(current_ticker);
    // console.log(tickerNameResult);
    // Distinct ticker names in this array
    tickerNames.push(current_ticker.ticker);
  });
  console.log("\x1b[44m%s\x1b[0m", "All Ticker names Obtained");

  for (ticker of tickerNames) {
    let tickerObject = new stocksData();
    // let tickerObject = {};
    tickerObject.ohlc_dates = {};
    const companyName = `select distinct(company) from yahoodata where ticker = '${ticker}'`;
    let companyRes = await db.any(companyName);
    tickerObject.company_name = companyRes[0]["company"];
    let indicator_date = [];
    const indicatorDatesquery = `select distinct(dates) from yahoodata where ticker = '${ticker}' order by dates`;
    const res = await db.any(indicatorDatesquery);
    // Pushing dates into array for that ticker name
    for (result of res) {
      var formatedDate = new Date(result["dates"]);
      formatedDate = formatedDate.toISOString().substring(0, 10);
      indicator_date.push(formatedDate);
    }
    // Iterating with indicator names and ticker name for date and corresponding value
    for (current_indicator_date of indicator_date) {
      //   console.log(
      //     "current date",
      //     current_indicator_date,
      //     " formatted date: ",
      //     formatedDate
      //   );
      tickerObject.ohlc_dates[`${current_indicator_date}`] = {};
      const getTickerValues = `select opening,high,low,closing,adjclose,volume from yahoodata where ticker='${ticker}' and dates='${current_indicator_date}';`;
      const f_res = await db.any(getTickerValues);
      if (f_res.length > 0) {
        tickerObject.ohlc_dates[`${current_indicator_date}`] = {};
        // console.log("\x1b[33m%s\x1b[0m", f_res);
        f_res.forEach(f_result => {
          //   console.log(ticker);
          // for opening value
          tickerObject.ohlc_dates[`${current_indicator_date}`][
            "opening"
          ] = parseFloat(f_result["opening"]);
          // For high value
          tickerObject.ohlc_dates[`${current_indicator_date}`][
            "high"
          ] = parseFloat(f_result["high"]);
          // for low values
          tickerObject.ohlc_dates[`${current_indicator_date}`][
            "low"
          ] = parseFloat(f_result["low"]);
          // For closing values
          tickerObject.ohlc_dates[`${current_indicator_date}`][
            "closing"
          ] = parseFloat(f_result["closing"]);
          // For adj close values
          tickerObject.ohlc_dates[`${current_indicator_date}`][
            "adjclose"
          ] = parseFloat(f_result["adjclose"]);
          // For volumes on that day
          tickerObject.ohlc_dates[`${current_indicator_date}`][
            "volume"
          ] = parseFloat(f_result["volume"]);
        });
      }
    }

    MongoClient.connect("mongodb://localhost:27017", function(err, client) {
      if (err) throw err;
      else {
        // Initializing data base to use (MONGODB)
        let database = client.db("stocks");
        database.collection("stocks_data").findOneAndUpdate(
          { ticker_name: `${ticker}` },
          {
            $set: {
              ohlc_dates: tickerObject.ohlc_dates,
              company_name: tickerObject.company_name
            }
          },
          function(err, res) {
            if (err) {
              console.log(err);
            } else {
              console.log("Data Updated for Ticker: ".bgWhite.red, ticker);
            }
          }
        );
      }
    });
  }
}
