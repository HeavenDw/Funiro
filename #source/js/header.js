//Меню бургер
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu__body');
if (iconMenu){
    iconMenu.addEventListener('click', function(e) {
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
        document.body.classList.toggle('_lock');
    });
}

function smoothScroll() {
    //Smoth scroll
    //находим все ссылки с атт data-goto, помещаем их в список gotoLinks
    const gotoLinks = document.querySelectorAll('a[data-goto]');
    //проверяем на наличие
    if (gotoLinks.length > 0) {
        //вешаем на каждый элемент списка слушатель по клику, при клике запускаю функцию
        gotoLinks.forEach(gotoLink => {
            gotoLink.addEventListener('click', ongotoLinkClick);
        });

        //функция скролла
        function ongotoLinkClick(e) {
            //чекаем объект по которому кликнули на наличие атт data-goto и записываем его в gotoLink
            const gotoLink = checkTarget(e.target);
            
            //проверяем не пустой ли атт и есть ли элементы, которые подходят по описанию из атт
            if(gotoLink.dataset.goto && document.querySelector(gotoLink.dataset.goto)) {
                //записываем в переменную блок, до которого надо проскролить
                const gotoBlock = document.querySelector(gotoLink.dataset.goto);
                //высчитываем верхней точки блока - высота шапки
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;;

                //убираем активные классы, если при клике открыто меню
                if (iconMenu.classList.contains('_active')){
                    iconMenu.classList.remove('_active');
                    menuBody.classList.remove('_active');
                    document.body.classList.remove('_lock');
                }

                //запускаем скролл до блока
                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: "smooth"
                });
                //убираем обычное поведение ссылки
                e.preventDefault();
            }
        }

        //принимает на вход объект по которому кликнули
        function checkTarget(target) {
            //проверяет есть ли у объекта атт data-goto
            if(target.dataset.goto){
                //возвращает объект, если есть атт
                return target;
            }else {
                //возвращает ближайщую ссылку-родителя, если нет атт
                return target.closest('a');
            }
        }
    }
}

smoothScroll();