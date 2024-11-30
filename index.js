"use strict";

const display = document.querySelector('.display');
const cellCount = 12;

// ディスプレイの作成
for (let count = 0; count < cellCount; count++){
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.textContent = 0;
  display.appendChild(cell);
}

let row = [];
const cells = display.children;

// 配列をディスプレイに表示
const DisplayOperate = function (array) {  
  const difference = cells.length - array.length;
  const rest = Array(difference).fill(0);
  const goal = rest.concat(array);

  Array.from(cells).forEach((elm, index, _elms) => {
    if (/^[0-9\+\-\÷\×]$/.test(goal[index])) {
      elm.textContent = goal[index];      
    } else {
      throw new Error('不正な値');
    }
  });

  let activeFlag = false;
  Array.from(cells).forEach((elm, index, elms) => {
    if (/[1-9\+\-\÷\×]/.test(elm.textContent) || index + 1 === elms.length) {
      activeFlag = true;
    }

    const classOperate = activeFlag ? 'add' : 'remove';
    elm.classList[classOperate]('isActive');
  });
}

// 数字
for (const operand of document.querySelectorAll('.button[data-type="number"]')) {
  operand.addEventListener('click', function () {
    if (this.textContent.includes('0') && row.length === 0) return false;
    if (row.length === 12) {
      alert('Error: 文字数オーバー');
      row = [];
    } else {
      row = [...row, ...this.textContent.split('')];
    }
    DisplayOperate(row);
  });
};

class Operator {
  #result_function = null;

  constructor() {
    this.combineFormulas({ type: 'addition',       innerFunction: constant_num => { return (current_num) => { return constant_num + current_num } } });             // +
    this.combineFormulas({ type: 'subtraction',    innerFunction: constant_num => { return (current_num) => { return constant_num - current_num } } });             // -
    this.combineFormulas({ type: 'multiplication', innerFunction: constant_num => { return (current_num) => { return constant_num * current_num } } });             // ×
    this.combineFormulas({ type: 'division',       innerFunction: constant_num => { return (current_num) => { return Math.floor(constant_num / current_num) } } }); // ÷

    this.clearCurrentNumber({ type: 'double_clear', splice_index: 0 })  // CC
    this.clearCurrentNumber({ type: 'single_clear', splice_index: -1 }) // C

    this.executeFormulas(); // =
  };

  // 数式作成
  combineFormulas({ type, innerFunction }) {
    document.querySelector(`.button[data-type="${type}"]`).addEventListener('click', () => {
      // ディスプレイから値を取得
      const current_value = row.reduce((accumulator, currentValue) => accumulator += currentValue, 0);
      
      // 値の加工
      const current_num = Number(current_value);
      const constant_num = (this.#result_function === null) ? current_num : this.#result_function(current_num);

      // ディスプレイをまっさらに
      row = [];
      DisplayOperate(row);

      // 結果がINTINITIEの場合を考慮
      if (isFinite(constant_num)) {
        // 関数を共有
        this.#result_function = innerFunction(constant_num);
      } else {
        window.alert('INFINITIE');
        this.#result_function = null;
      };
    });
  }

  // ディスプレイから取り除く
  clearCurrentNumber({ type, splice_index }) {
    document.querySelector(`.button[data-type="${type}"]`).addEventListener('click', () => {
      row.splice(splice_index);
      DisplayOperate(row);
    });
  }

  // 数式実行
  executeFormulas() {
    document.querySelector('.button[data-type="equal"]').addEventListener('click', () => {
      // 演算子をまだ押していない場合、引き返す
      if (this.#result_function === null) return false;

      // ディスプレイから値を取得
      const current_value = row.reduce((accumulator, currentValue) => accumulator += currentValue, 0);
      
      // 計算結果をディスプレイに表示
      const result_value = this.#result_function(Number(current_value));
      DisplayOperate(isFinite(result_value) ? result_value.toString().split('') : window.alert('INFINITIE') || []);

      // 初期化
      this.#result_function = null;
      row = [];
    });
  }
}

new Operator;