const request = require("supertest");
const app = require("../../index");

// describe("Testing NavBar API", () => {
//   it("(View indices of respected  id) should return a status code of 200,the body should be an object,a message in the body,the data should be an object", done => {
//     let searchInput = "AA";
//     let payload = JSON.stringify(searchInput);
//     request(app)
//       .post("/api/navbar/search")
//       .send(payload)
//       .set("Content-type", "application/json")
//       .then(res => {
//         expect(res.status).toBe(200);
//         expect(res.body).toEqual(expect.any(Object));
//         expect(res.body.data).toEqual(expect.any(Object));
//         expect(res.body.message).toBe("Retrieved Indices successfully");
//         done();
//       });
//   });
// });

describe("Testing Navbar API", () => {
  it("(Search Results Found) should return a status of 200  when give the search results", done => {
    let data = {
      searchInput: "MSFT"
    };
    let payload = JSON.stringify(data);
    request(app)
      .post("/api/navbar/search")
      .send(payload)
      .set("Content-type", "application/json")
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
        expect(response.body.message).toBe(
          "Retrieved Search Result successfully"
        );
        done();
      });
  });
  it("(Search Results Not Found) should return a status of 400  when does not give search results", done => {
    let data = {
      searchInput: "1234"
    };
    let payload = JSON.stringify(data);
    request(app)
      .post("/api/navbar/search")
      .send(payload)
      .set("Content-type", "application/json")
      .then(response => {
        expect(response.status).toBe(400);
        expect(response.body).toEquresultal(expect.any(Object));
        expect(response.body.message).toBe("No Data Found");
        done();
      });
  });

  it("( Results Found) should return a status of 200  when give the search results", done => {
    let data = {
      name: {
        ticker_name: "AAPL",
        ticker_id: 9,
        industry: "Computer Hardware",
        price: 25
      },
      searchInput: "MSFT"
    };
    let payload = JSON.stringify(data);
    request(app)
      .post("/api/navbar/search")
      .send(payload)
      .set("Content-type", "application/json")
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.any(Object));
        expect(response.body.message).toBe(
          "Retrieved Search Result successfully"
        );
        done();
      });
  });
});
