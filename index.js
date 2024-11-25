"use strict";

const display = document.querySelector('.display');
const displayChildLimit = 12;
let display_items = [];

// ディスプレイの作成
for (let num = 0; num < displayChildLimit; num++){
  const displayChild = document.createElement('div');
  displayChild.className = 'cell';
  displayChild.textContent = 0;
  display.appendChild(displayChild);
}

// アクティブな数字
const DisplayBlink = function() {
  let activeFlag = false;
  Array.from(display.children).forEach((elm, index, elms) => {
    if (/[1-9\+\-\÷\×]/.test(elm.textContent) || index + 1 === elms.length) {
      activeFlag = true;
    }

    const classOperate = activeFlag ? 'add' : 'remove';
    elm.classList[classOperate]('isActive');
  });
  activeFlag = false;
};
DisplayBlink();

// 配列をディスプレイに表示
const DisplayOperate = function (array) {
  if (array.length > 12) {
    alert('Error: 文字数オーバー');
    display_items = [];
    array = [];
  };
  
  const difference = display.children.length - array.length;
  const rest = Array(difference).fill(0);
  const goal = rest.concat(array);

  Array.from(display.children).forEach((elm, index, _elms) => {
    if (/^[0-9\+\-\÷\×]$/.test(goal[index])) {
      elm.textContent = goal[index];      
    } else {
      throw new Error('不正な値');
    }
  });
  DisplayBlink();
}

// 1 ~ 9 をクリック時
for (const btn of document.querySelectorAll('.button[data-type="number"]')) {
  btn.addEventListener('click', function () {
    display_items.push(this.textContent);
    DisplayOperate(display_items);
  })
}

// 0 をクリック時
document.querySelector('.button[data-type="single_zero"]').addEventListener('click', function () {
  if (display_items.length == 0) return false;
  display_items.push(this.textContent);
  DisplayOperate(display_items);
})

// 00 をクリック時
document.querySelector('.button[data-type="double_zelo"]').addEventListener('click', function () {
  if (display_items.length == 0) return false;
  display_items = display_items.concat([0, 0]);
  DisplayOperate(display_items);
})

// CCをクリック
document.querySelector('.button[data-type="double_clear"]').addEventListener('click', function () {
  display_items = [];
  DisplayOperate(display_items);
});

// Cをクリック
document.querySelector('.button[data-type="single_clear"]').addEventListener('click', function () {
  display_items.pop();
  DisplayOperate(display_items);
});

class Operator {
  #result_function = null;

  constructor() {
    this.combineFormulas({ type: 'addition',       innerFunction: constant_num => { return (current_num) => { return constant_num + current_num } } });             // +
    this.combineFormulas({ type: 'subtraction',    innerFunction: constant_num => { return (current_num) => { return constant_num - current_num } } });             // -
    this.combineFormulas({ type: 'multiplication', innerFunction: constant_num => { return (current_num) => { return constant_num * current_num } } });             // ×
    this.combineFormulas({ type: 'division',       innerFunction: constant_num => { return (current_num) => { return Math.floor(constant_num / current_num) } } }); // ÷

    this.executeFormulas(); // =
  };

  // 数式作成
  combineFormulas({ type, innerFunction }) {
    document.querySelector(`.button[data-type="${type}"]`).addEventListener('click', () => {
      // ディスプレイから値を取得
      const current_value = display_items.reduce((accumulator, currentValue) => accumulator += currentValue, 0);
      
      // 値の加工
      const current_num = Number(current_value);
      const constant_num = (this.#result_function === null) ? current_num : this.#result_function(current_num);

      // ディスプレイをまっさらに
      display_items = [];
      DisplayOperate(display_items);

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

  // 数式実行
  executeFormulas() {
    document.querySelector('.button[data-type="equal"]').addEventListener('click', () => {
      // 演算子をまだ押していない場合、引き返す
      if (this.#result_function === null) return false;

      // ディスプレイから値を取得
      const current_value = display_items.reduce((accumulator, currentValue) => accumulator += currentValue, 0);
      
      // 計算結果をディスプレイに表示
      const result_value = this.#result_function(Number(current_value));
      DisplayOperate(isFinite(result_value) ? result_value.toString().split('') : window.alert('INFINITIE') || []);

      // 初期化
      this.#result_function = null;
      display_items = [];
    });
  }
}

new Operator;