'use strict';

const goBack = document.querySelector('.btn--back');
const artist = document.querySelector('.artist');
const maxNumOfChars = 20;

goBack.addEventListener('click', goToPreviousPage);

function goToPreviousPage() {
    window.history.back();
    console.log('previous page');
}