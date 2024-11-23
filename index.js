"use strict";

const display = document.querySelector('.display');
const displayChildLimit = 12;

// ディスプレイの作成
for (let num = 0; num < displayChildLimit; num++){
  const displayChild = document.createElement('div');
  displayChild.className = 'cell';
  displayChild.textContent = 0;
  display.appendChild(displayChild);
}

// アクティブな数字
let activeFlag = false;
const DisplayBlink = function() {
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

let display_items = [];
const buttons = document.querySelectorAll('.button');
let result_function = null;

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

// TODO 動作確認 & 0 ÷ xxx した時のinfinitie問題の確認
class Operator {
  constructor(type, func) {
    this._type = type;
    this._func = func;
    this.combineFormulas();
  }

  // 数式の作成
  combineFormulas () {
    document.querySelector(`.button[data-type="${this._type}"]`).addEventListener('click', () => {
      // ディスプレイから値を取得
      const current_value = display_items.reduce((accumulator, currentValue) => accumulator += currentValue, 0);
      
      // 値の加工
      const current_num = Number(current_value);
      const constant_num = (result_function === null) ? current_num : result_function(current_num);

      // ディスプレイをまっさらに
      display_items = [];
      DisplayOperate(display_items);

      // 関数を共有
      result_function = this._func(constant_num);
    });
  }
}

// +をクリック
new Operator('addition', constant_num => {
  return (current_num) => {
    return constant_num + current_num;
  };
});

// -をクリック
new Operator('subtraction', constant_num => {
  return (current_num) => {
    return constant_num - current_num;
  };
});

// ✖️をクリック
new Operator('multiplication', constant_num => {
  return (current_num) => {
    return constant_num * current_num;
  };
});

// ÷をクリック
new Operator('division', constant_num => {
  return (current_num) => {
    return Math.floor(constant_num / current_num);
  };
});

// =をクリック
document.querySelector('.button[data-type="equal"]').addEventListener('click', function () {
  if (result_function === null) return false;

  const current_value = display_items.reduce((accumulator, currentValue) => accumulator += currentValue, 0);
  let result_value = result_function(Number(current_value));
  result_value = isFinite(result_value) ? result_value.toString().split('') : [];
  DisplayOperate(result_value);

  result_function = null
  display_items = [];
});
