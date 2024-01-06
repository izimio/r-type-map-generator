export const getLocalStorageItem: (stateName: string) => any = (stateName) => {
  try {
    const serializedState = localStorage.getItem(stateName);
    if (serializedState === null) {
      console.error("No local storage item found with name: ", stateName);
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("An error occurred while getting local storage item: ", err);
    return undefined;
  }
};

export const saveLocalStorageItem: (stateName: string, state: any) => void = (
  stateName,
  state
) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateName, serializedState);
  } catch (err) {
    console.error("An error occurred while saving local storage item: ", err);
  }
};
