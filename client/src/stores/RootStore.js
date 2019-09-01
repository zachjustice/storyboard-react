import { createStore } from "redux";
import rootReducer from "../reducers/RootReducer";
import {getChoice, INITIAL_CHOICE_ID} from "../services/Choices.service";
import {selectOption} from "../actions/ActionCreators";

const store = createStore(rootReducer);

getChoice(INITIAL_CHOICE_ID).then(choice => {
    console.log('get initial choice', choice);
    store.dispatch(selectOption(0, choice));
});

export default store;
