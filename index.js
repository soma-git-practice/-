"use strict";

const display = document.querySelector('.display');

// アクティブな数字
let activeFlag = false;
const DisplayBlink = function() {
  [...display.children].forEach((elm, index, elms) => {
    if (/[1-9]/.test(elm.textContent) || index + 1 === elms.length) {
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
  if (array.length > 12) { throw new Error('文字数オーバー') };
  
  const difference = display.children.length - array.length;
  const rest = Array(difference).fill(0);
  const goal = rest.concat(array);

  [...display.children].forEach((elm, index, _elms) => {
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
let result = null;

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

// +をクリック
document.querySelector('.button[data-type="addition"]').addEventListener('click', function () {
  let num = display_items.reduce((accumulator, currentValue) => accumulator += currentValue)
  num = Number(num);
  const sahen = (result === null) ? num : result(num)
  // TODO 画面の数字消す
  result = function (arg) {
    return sahen + arg;
  }
});

// =をクリック
document.querySelector('.button[data-type="equal"]').addEventListener('click', function () {
  let num = display_items.reduce((accumulator, currentValue) => accumulator += currentValue)
  num = Number(num);
  if (result === null) return false;
  const sahen = result(num)
  debugger

  // TODO 数字を一文字ずつの配列にする。
  result = null
});