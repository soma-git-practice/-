"use strict";

const display = document.querySelector('.display');

// ボタンに反応させる
const buttons = document.querySelectorAll('.button');
for (const btn of buttons) {
  btn.addEventListener('click', e => {    
    console.log(e.target.innerHTML)
  })
}

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
  // arrayそのものを置き換えてしまう問題
  array.length = 12;
  array.reverse();
  [...display.children].reverse().forEach((elm, index, _elmls) => {
    elm.textContent = /[1-9\+\-\÷\×]/.test(array[index]) ? array[index] : 0;
    DisplayBlink();
  }) 
}
const example = ["1", "2", "3", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
DisplayOperate(example);