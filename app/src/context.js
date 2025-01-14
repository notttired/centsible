import { createContext } from "react";
export const foldersContext = createContext(null);
export const transfersContext = createContext(null);
export const usernameContext = createContext(null);

export const fieldTypes = [
  `source`,
  `amount`,
  `date`,
  `recurrence`,
  `completion`,
];
