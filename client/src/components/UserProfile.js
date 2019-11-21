import React, { Component } from "react";
import "../styles/UserProfile.css";
import UserNavigation from "./Common/UserNavigation";
import { connect } from "react-redux";
import { searchContent } from "../actions/Navbar";
import { Link } from "react-router-dom";

export class UserProfile extends Component {
  state = {
    // input text in the search box
    searchInput: "",
    searchInputChanged: false
  };

  OnChange = event => {
    // search results display
    {
      this.state.searchInputChanged
        ? console.log(this.state.searchInputChanged)
        : this.setState({
            searchInputChanged: true
          });
    }
    this.setState({ [event.target.name]: event.target.value });
    // debounce(() => {

    let searchString = {
      searchInput: this.state.searchInput
    };
    this.props.searchContent(searchString);
    // }, 1000);
  };

  onSearch = e => {
    e.preventDefault();

    let searchString = {
      searchInput: this.state.searchInput
    };

    this.props.searchContent(searchString);
    // this.setState({
    //   searchInput: ""
    // });
  };

  render() {
    return (
      <div>
        <div id="userProfileContainer">
          {/* Navigation for User profile */}
          <UserNavigation />
          {/* Search sectin to Buy Stocks */}
          <div id="userSearch">
            <h1>Welcome to HeadStocks Simulator</h1>
            <input
              type="text"
              placeholder="Search for Stocks you want to buy (E.g . AAPL)"
              name="searchInput"
              id="userProfileSearch"
              value={this.state.searchInput}
              onChange={this.OnChange}
            />
            <button type="submit" id="userProfileSearchButton">
              <i class="fa fa-search"></i>
            </button>

            {this.state.searchInput == "" ? null : (
              <div className="search-result">
                {this.props.results.length != 0 ? (
                  this.props.results.map((stocks, index) => (
                    <div>
                      {/* // <span className="search_result_data"> */}
                      {/* Link to redirect the user to details of player on click -Rohan */}

                      <p
                        style={{
                          fontSize: "18px",
                          paddingTop: "0px ",
                          display: "flex",
                          justifyContent: "center"
                        }}
                      >
                        {" "}
                        {stocks.ticker_name}
                        <a href="#open-modal" id="buyButton">
                          Buy
                        </a>
                        <div id="open-modal" class="modal-window">
                          <div>
                            <a
                              href="#modal-close"
                              title="Close"
                              class="modal-close"
                            >
                              &times;
                            </a>
                            <h1>CSS Modal</h1>
                            <div>
                              The quick brown fox jumped over the lazy dog.
                            </div>
                          </div>
                        </div>
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "10px 10px" }}>No Company Found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  results: state.navbarReducer.results,
  isLoading: state.LoadingReducer.isLoading
});

export default connect(mapStateToProps, { searchContent })(UserProfile);

{
  /* Pop Up for buying n number of stocks
            <a href="#open-modal" id="buyButton">
              Buy
            </a>
            <div id="open-modal" class="modal-window">
              <div>
                <a href="#modal-close" title="Close" class="modal-close">
                  &times;
                </a>
                <h1>CSS Modal</h1>
                <div>The quick brown fox jumped over the lazy dog.</div>
              </div>
            </div> */
}
