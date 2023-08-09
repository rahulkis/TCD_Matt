import { combineReducers } from "redux";
import sidebar from "./SidebarReducer";

const reducers = combineReducers({
    sidebar: sidebar,
  
});

export default reducers;