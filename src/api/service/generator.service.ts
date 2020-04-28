import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Generator } from '../model/generator';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  generator: Generator = {
    characterTable: [],
    isEditable: true,
    isRefreshTable: false,
    isStarted: false,
    code: 0,
    inChar: "",
    counter: 0
  };

  constructor() {
    this.initGenerator();
  }

  initGenerator() {
    this.generator.isEditable = true;
    this.generator.isRefreshTable = false;
    this.generator.isStarted = false;
    this.generator.code = 0;
    this.generator.inChar = "";

    for (let i = 0; i < 10; i++) {
      this.generator.characterTable[i] = [];
      for (let j = 0; j < 10; j++) {
        this.generator.characterTable[i][j] = "";
      }
    }
  }

  getGeneratorData(): Observable<Generator> {
    return of(this.generator);
  }

  startGenerator() {
    this.generator.isStarted = true;
    this.generator.isEditable = true;
    this.generator.isRefreshTable = true;
    this.generator.counter = 0;
    this.generateCharacterTable();
    this.generateCode();

    this.startTimer();
  }

  startTimer() {
    setInterval(() => {
      this.generator.counter = (this.generator.counter + 1) % 4;
      if (this.generator.counter === 0) {
        this.generator.isEditable = !this.generator.isEditable;
      }
      this.generator.isRefreshTable = !this.generator.isRefreshTable;
      if (this.generator.isRefreshTable) {
        this.generateCharacterTable();
        this.generator.code = this.generateCode();
      }
    }, 1000);
  }

  generateCharacterTable() {
    for (let i = 0; i < 10; i++) {
      this.generator.characterTable[i] = [];
      for (let j = 0; j < 10; j++) {
        this.generator.characterTable[i][j] = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
      }
    }
    if (this.generator.inChar !== "") {
      this.spreadCharacter(this.generator.inChar);
    }
  }

  spreadCharacter(char: string) {
    // If you also find an optional input field which allows the user to enter an alphabetic character (a-z)
    // and this character will be used as a weight constant of 20% when filling the grid, like so:
    // If a character is entered and it’s a “z”, means that 20% of the grid cells will be filled with “z”
    // and the remaining ones with random characters.

    // Change two-dimension array into one-dimension array: characterTable
    // At this time, the index are change from [i, j] (i,j = 0 ~ 9) to [k] (k = 0 ~ 99)
    // setIndex : the set of Indexes in which characters are the same as the character being entered by user.
    // restIndex : the set of Indexes in which characters are not the same as the character being entered by user.
    let setIndex: number[] = [];
    let restIndex: number[] = [];

    // Initialize setIndex and restIndex from Table
    for (let k = 0; k < 100; k++) {
      let i = Math.floor(k / 10);
      let j = k % 10;
      if (this.generator.characterTable[i][j] === char) {
        setIndex.push(k);
      } else {
        restIndex.push(k);
      }
    }

    // Set setIndex and restIndex as a weight constant of 20%
    let restLength = 20 - setIndex.length;
    for (let k = 0; k < restLength; k++) {
      let set_num = Math.floor(Math.random() * restIndex.length);
      setIndex.push(restIndex[set_num]);
      restIndex.splice(set_num, 1);
    }

    // Modify Table
    console.log(typeof setIndex);
    for (let k = 0; k < 20; k++) {
      let i = Math.floor((setIndex[k] / 10));
      let j = setIndex[k] % 10;
      this.generator.characterTable[i][j] = char;
    }
  }

  generateCode() {
    // There is a display field underneath the table with the 2 digit code.
    // To populate this field, the following trivial algorithm needs to be followed:
    // 1. Get the 2 digit seconds from the clock, like so: 12:40:36.
    // 2. Get the matching grid cell values for the positions [3,6] and [6,3], like so: “v” and “c”.
    // 3. Count the occurrences of “v” and “c” on the entire grid, like so: v = 7, c = 9.
    // 4. If the count is larger than 9, divide the count by the lowest integer possible
    //    in order to get a value lower or equal to 9. *roundup the result if decimal.
    // 5. Done! That is your code: 79

    // 1. Get first_digit and second_digit
    // the current second = first_digit * 10 + second_digit([first_digit][second_digit])
    let curSecond = new Date().getSeconds();
    let first_digit = Math.floor(curSecond / 10) % 10;
    let second_digit = curSecond % 10;

    // 2. Get the matching grid cells
    // first_cell = Table[first_digit][second_digit]
    // second_cell = Table[second_digit][first_digit]
    let first_cell = this.generator.characterTable[first_digit][second_digit];
    let second_cell = this.generator.characterTable[second_digit][first_digit];

    // 3. Count the occurrences
    let first_count = 0;
    let second_count = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.generator.characterTable[i][j] === first_cell) {
          first_count++;
        }
        if (this.generator.characterTable[i][j] === second_cell) {
          second_count++;
        }
      }
    }
    first_count = this.checkCount(first_count);
    second_count = this.checkCount(second_count);

    // 5. Get the code
    let code = first_count * 10 + second_digit;

    return code;
  }

  checkCount(num: number) {
    // If the count is larger than 9, divide the count by the lowest integer possible
    // in order to get a value lower or equal to 9. *roundup the result if decimal.
    let divisor = 1;
    let checked_num = num;
    while (checked_num > 9) {
      divisor++;
      checked_num = Math.ceil(checked_num / divisor);
    }
    return checked_num;
  }

}
