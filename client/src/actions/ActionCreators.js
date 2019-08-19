import {ActionTypes} from "./ActionTypes";

export const addChoice = (choice) => ({
  type: ActionTypes.addChoice,
  choice
});