"use strict";

const display = document.querySelector('.display');

// ボタンに反応させる
const buttons = document.querySelectorAll('.button');
for (const btn of buttons) {
  btn.addEventListener('click', e => console.log(e.target.innerHTML))
}