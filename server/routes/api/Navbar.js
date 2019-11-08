const express = require("express");
const router = express.Router();
const url = "mongodb://localhost:27017/";
var MongoClient = require("mongodb").MongoClient;

//gets the search results from database - Harshal
router.post("/search", async (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    // selecting the database "stocks"
    var dbo = db.db("stocks");
     dbo
    // selecting the collection "stocks_data"
      .collection("stocks_data")
       .find(
        //  search the results in two different attributes
       { $or:[
        //  when the search has an industry value
         {industry : req.body.searchInput} ,
        //  when the search has an Ticker value
         {ticker_name: req.body.searchInput}
      ]}
        )
        // converts the results to an array
      .toArray(function(err, result) {
        // if something goes wrong it will throw error
        if (err) throw err;
        if(result==0){
        // If Failed to get result and executes then sends this response to the search action
        res.status(400).json({
          status: 400,
          data: result,
          message: "Search Result not found"
        });
        }
        else {
        // If successfully executes then sends this response to the search action
        res.status(200).json({
          status: 200,
          data: result,
          message: "Retrieved Search Result successfully"
        });
        }
        db.close();
      });
  });
});
// Exports file 
module.exports = router;