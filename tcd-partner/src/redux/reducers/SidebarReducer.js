import { COLLAPSE_SIDEBAR } from "../constants/ActionConstant";

const INIT_STATE = {
  collapse: false,
};

export default function timing(state = INIT_STATE, action) {
  switch (action.type) {
    case COLLAPSE_SIDEBAR:
      return {
        collapse: !state.collapse,
      };
    default:
      return state;
  }
}
