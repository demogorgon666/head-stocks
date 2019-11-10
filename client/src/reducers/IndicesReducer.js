import { GET_INDICES_BYID, OHLC_CHART_INDEX } from "../actions/Types";

const initialstate = {
  singleIndex: [],
  ohlcChart: []
};

export default function(state = initialstate, action) {
  switch (action.type) {
    case GET_INDICES_BYID:
      return { ...state, singleIndex: action.payload };
    case OHLC_CHART_INDEX:
      return { ...state, ohlcChart: action.payload };
    default:
      return state;
  }
}
