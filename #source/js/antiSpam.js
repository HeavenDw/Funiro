//anti-spam
function antiSpam () {
    //находим чекбокс в форме
    let checkbox = document.querySelector('.anti-spam');
    if (checkbox) {
        //снимаем чекед
        checkbox.checked = false;
    }
}

antiSpam();