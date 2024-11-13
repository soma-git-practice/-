"use strict";

const display = document.querySelector('.display');

// ボタンに反応させる
const buttons = document.querySelectorAll('.button');
for (const btn of buttons) {
  btn.addEventListener('click', e => {    
    console.log(e.target.innerHTML)
  })
}

// クリックしたものを１の位に表示する

// display.childrenを順番に見ていき０以外が登場したら以降に.isActiveを追加する。
// 一度も登場しなかった場合一番後ろに.isActiveを追加する。
const displayItems = display.children;

[...displayItems].reduce((result, current) => {
  result.push(current);
  return result;
}, [])
