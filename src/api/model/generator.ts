export interface Generator {
  characterTable: string[][];
  isEditable: boolean;
  isRefreshTable: boolean;
  isStarted: boolean;
  code: number;
  inChar: string;
  counter: number;
}
