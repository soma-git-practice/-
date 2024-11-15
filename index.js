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

// ボタンに反応させて配列に追加する
const display_items = [];
const buttons = document.querySelectorAll('.button');

for (const btn of buttons) {
  btn.addEventListener('click', function () {

    display_items.push(this.textContent);
    DisplayOperate(display_items);

  })
}