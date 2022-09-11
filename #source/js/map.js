;(function() {
    //выбираем блок в котором находится карта
    var sectionContacts = document.querySelector('.contacts');

    //проверяем на сущестование данный блок
    if (!sectionContacts) {
    return;
    }

    //функция инизиализации карты
    var ymapInit = function() {
        //если апи яндекса не прогрузилось, то возвращаемся
        if (typeof ymaps === 'undefined') {
          return;
        }

        //если апи прогрузилось, то создаем карту
        ymaps.ready(function () {
            var ymap = document.querySelector('.contacts__map');
            //берем аттрибут с координатами (берется из админки вп) из блока с картой
            var mapCoordinates = '58.004585, 56.196385';
            //берем аттрибут с адресом (берется из админки вп) из блока с картой
            var mapAddress = 'г. Пермь, улица Ленина, 87';

            var myMap = new ymaps.Map('ymap', {
                //задаем координаты карты или берем их из переменной
                center: mapCoordinates.split(','),
                zoom: 17,
            }, {
                searchControlProvider: 'yandex#search'
            }),

            //подключаем маркер
            myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                hintContent: mapAddress,
            }, {
                /**
                 * Options.
                 * You must specify this type of layout.
                 */
                iconLayout: 'default#image',
                // Custom image for the placemark icon.
                iconImageHref: '/img/icons/map-marker.png',
                // The size of the placemark.
                iconImageSize: [61, 65],
                /**
                 * The offset of the upper left corner of the icon relative
                 * to its "tail" (the anchor point).
                 */
                iconImageOffset: [-5, -38]
            });

                myMap.geoObjects
                    .add(myPlacemark);

                //убираем зум при скролле
                myMap.behaviors.disable('scrollZoom');
            });
        };

    var ymapLoad = function() {
        //создаем скрипт с апи в html
        var script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=en_RU';
        body = document.querySelector('body');
        body.append(script);
        //при загрузке скрипта запускаем функцию инициализации карты
        script.addEventListener('load', ymapInit);
    };

    //проверяем высоту окна
    var checkYmapInit = function() {
        var sectionContactsTop = sectionContacts.getBoundingClientRect().top;
        var scrollTop = window.pageYOffset;
        var sectionContactsOffsetTop = scrollTop + sectionContactsTop;

        if (scrollTop + window.innerHeight > sectionContactsOffsetTop) {
            //запускаем загрузку карты и убираем проверку скролла
            ymapLoad();
            window.removeEventListener('scroll', checkYmapInit);
        }
    };

    //запускаем функцию при скролле и при загрузке страницы сайта
    window.addEventListener('scroll', checkYmapInit);
    checkYmapInit();
})();