import { createStore } from "redux";
import rootReducer from "../reducers/RootReducer";
import {getChoice, INITIAL_CHOICE_ID} from "../services/Choices.service";
import {addChoice} from "../actions/ActionCreators";

const store = createStore(rootReducer);

getChoice(INITIAL_CHOICE_ID).then(choice => {
    store.dispatch(addChoice(0, choice));
});

export default store;
