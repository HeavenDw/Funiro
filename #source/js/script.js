var isMobile = {Android: function() {return navigator.userAgent.match(/Android/i);},BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},Windows: function() {return navigator.userAgent.match(/IEMobile/i);},any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}};

window.onload = function () {
    document.addEventListener("click", documentActions);

    // Actions (делегирование события click)
    function documentActions(e) {
        const targetElement = e.target;
        if(window.innerWidth > 767.98 && isMobile.any()) {
            if(targetElement.classList.contains('menu__arrow')) {
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if(!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
                document.querySelectorAll('.menu__item._hover').forEach(element => {
                    element.classList.remove('_hover');
                });
            }
            if(targetElement.classList.contains('menu__sub-link')){
                document.querySelectorAll('.menu__item._hover').forEach(element => {
                    element.classList.remove('_hover');
                });
            }
        }
        if(targetElement.classList.contains('search-form__icon')) {
            document.querySelector('.search-form').classList.toggle('_active');
        }else if(!targetElement.closest('.search-form') && document.querySelector('.search-form._active')){
            document.querySelector('.search-form').classList.remove('_active');
        }

        if(targetElement.classList.contains('products__more')) {
            getProducts(targetElement);
            e.preventDefault();
        }

        if(targetElement.classList.contains('actions-product__button')) {
            const productId = targetElement.closest('.item-product').dataset.pid;
            addToCart(targetElement, productId);
            e.preventDefault();
        }

        if(targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
            if (document.querySelector('.cart-list').children.length > 0) {
                document.querySelector('.cart-header__body').classList.toggle('_active');
            }
            e.preventDefault();
        } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
            document.querySelector('.cart-header__body').classList.remove('_active');
        }

        if(targetElement.classList.contains('cart-list__delete')) {
            const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
            updateCart(targetElement, productId, false);
            e.preventDefault();
        }

    };

    const form = document.querySelector('.subscribe-footer__form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        form.classList.add('_disabled');
    });

    // Header
    const headerElement = document.querySelector('.header');

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            headerElement.classList.remove('_scroll');
        } else {
            headerElement.classList.add('_scroll');
        }
    }

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerElement);

    // Load more products
    async function getProducts(button) {
        if (!button.classList.contains('_hold')) {
            button.classList.add('_hold');
            const file = "json/products.json";
            let response = await fetch(file, {
                method: "GET"
            });
            if (response.ok) {
                let result = await response.json();
                loadProducts(result);
                button.classList.remove('_hold');
                button.remove();
            } else {
                alert("Ошибка");
            }
        }
    }

    function loadProducts(data) {
        const productsItems = document.querySelector('.products__items');

        data.products.forEach(item => {
            const productId = item.id;
            const productUrl = item.url;
            const productImage = item.image;
            const productTitle = item.title;
            const productText = item.text;
            const productPrice = item.price;
            const productOldPrice = item.priceOld;
            const productShareUrl = item.shareUrl;
            const productLikeUrl = item.likeUrl;
            const productLabels = item.labels;

            let labelsItems = ""
            let oldPrice = ""
            if (productLabels){
                
                productLabels.forEach(labelItem => {
                    labelsItems += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`
                });
            };
            if (productOldPrice){
                
                oldPrice = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`
            };
            let template = `
                    <article data-pid="${productId}" class="products__item item-product">
                        <div class="item-product__labels">
                            ${labelsItems}
                        </div>
                        <a href="${productUrl}" class="item-product__image _ibg">
                            <img src="img/products/${productImage}" alt="${productTitle}">
                        </a>
                        <div class="item-product__body">
                            <div class="item-product__content">
                                <h4 class="item-product__title">${productTitle}</h4>
                                <div class="item-product__text">${productText}</div>
                            </div>
                            <div class="item-product__prices">
                                <div class="item-product__price">Rp ${productPrice}</div>
                                ${oldPrice}
                            </div>
                            <div class="item-product__actions actions-product">
                                <div class="actions-product__body">
                                    <a href="# #" class="actions-product__button btn btn_white">Add to cart</a>
                                    <a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
                                    <a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
                                </div>
                            </div>
                        </div>
                    </article>
                    `

            productsItems.insertAdjacentHTML('beforeend', template);
        });
    }


    //spoiler
    const spoilersArray = document.querySelectorAll('[data-spoilers]');
    if(spoilersArray.length > 0) {
        // Получение обычных спойлеров
        const spoilersRegular = Array.from(spoilersArray).filter(function (item, index, self) {
            return !item.dataset.spoilers.split(",")[0];
        });
        // Инициализация обычных спойлеров
        if(spoilersRegular.length > 0) {
            initSpoilers(spoilersRegular);
        }

        // Получение спойлеров с медиа запросами
        const spoilersMedia = Array.from(spoilersArray).filter(function (item, index, self) {
            return item.dataset.spoilers.split(",")[0];
        });
        // Инициализация спойлеров с медиа запросами
        if(spoilersMedia.length > 0) {
            const breakpointsArray = [];
            spoilersMedia.forEach(item => {
                const params = item.dataset.spoilers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            })
            
            // Получаем уникальные брейкпоинты
            let mediaQuaries = breakpointsArray.map(function (item) {
                return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
            });
            mediaQuaries = mediaQuaries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });

            // Работаем с каждым брейкпоинтом
            mediaQuaries.forEach(breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);

                // Объекты с нужными условиями
                const spoilersArray = breakpointsArray.filter(function (item) {
                    if(item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });

                //Событие
                matchMedia.addEventListener('change', function () {
                    initSpoilers(spoilersArray, matchMedia);
                });
                initSpoilers(spoilersArray, matchMedia);
            });
        }

        // Инициализация
        function initSpoilers(spoilersArray, matchMedia = false) {
            spoilersArray.forEach(spoilersBlock => {
                spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spoilersBlock.classList.add('_init');
                    initSpoilerBody(spoilersBlock);
                    spoilersBlock.addEventListener("click", setSpoilerAction);
                } else {
                    spoilersBlock.classList.remove('_init');
                    initSpoilerBody(spoilersBlock, false);
                    spoilersBlock.removeEventListener("click", setSpoilerAction);
                }
            });
        }
        
        // Работа с контентом
        function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
            const spoilerTitles = spoilersBlock.querySelectorAll('[data-spoiler]');
            if (spoilerTitles.length > 0) {
                spoilerTitles.forEach(spoilerTitle => {
                    if (hideSpoilerBody) {
                        spoilerTitle.removeAttribute('tabindex');
                        if (!spoilerTitle.classList.contains('_active')) {
                            spoilerTitle.nextElementSibling.hidden = true;
                        }
                    } else {
                        spoilerTitle.setAttribute('tabindex', '-1');
                        spoilerTitle.nextElementSibling.hidden = false;
                    }
                })
            }
        }

        function setSpoilerAction(e) {
            const el = e.target;
            if (el.hasAttribute('data-spoiler') || el.closest('[data-spoiler')) {
                const spoilerTitle = el.hasAttribute('data-spoiler') ? el : el.closest('[data-spoiler]');
                const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
                const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler') ? true : false;
                if (!spoilersBlock.querySelectorAll('._slide').length) {
                    if (oneSpoiler && !spoilerTitle.classList.contains('_active')) {
                        hideSpoilersBody(spoilersBlock);
                    }
                    spoilerTitle.classList.toggle('_active');
                    _slideToggle(spoilerTitle.nextElementSibling, 500);
                }
                e.preventDefault();
            }
        }

        function hideSpoilersBody(spoilersBlock) {
            const spoilerActiveTitle = spoilersBlock.querySelector('[data-spoiler]._active');
            if (spoilerActiveTitle) {
                spoilerActiveTitle.classList.remove('_active');
                _slideUp(spoilerActiveTitle.nextElementSibling, 500);
            }
        }
    }

    let _slideUp = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = true;
                target.style.removeProperty('height');
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }

    let _slideDown = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            if (target.hidden) {
                target.hidden = false;
            }
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }

    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    }

    //==================================================================================================================================================
    /*
    Для родителя спойлеров пишем атрибут data-spoilers
    Для заголовков спойлеров пишем атрибут data-spoiler
    Если нужно включать/выключать работу спойлеров на разных размерах экранов то, пишем параметры ширины и типа брейкпоинта.
    Например:
    data-spoilers="992,max" - споллеры будут работать только на экранах меньше или равно 992px
    data-spoilers="768,min" - споллеры будут работать только на экранах больше или равно 768px

    Если нужно чтобы в блоке открывался только один спойлер, то добавляем атрибут data-one-spoiler
    */

    // addToCart
    function addToCart(productButton, productId) {
        if (!productButton.classList.contains('_hold')) {
            productButton.classList.add('_hold');
            productButton.classList.add('_fly');

            const cart = document.querySelector('.cart-header__icon');
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const productImage = product.querySelector('.item-product__image');

            const productImageFly = productImage.cloneNode(true);

            const productImageFlyWidth = productImage.offsetWidth;
            const productImageFlyHeight = productImage.offsetHeight;
            const productImageFlyTop = productImage.getBoundingClientRect().top;
            const productImageFlyLeft = productImage.getBoundingClientRect().left;
 
            productImageFly.setAttribute('class', '_flyImage _ibg');
            productImageFly.style.cssText = 
            `
            left: ${productImageFlyLeft}px;
            top: ${productImageFlyTop}px;
            width: ${productImageFlyWidth}px;
            height: ${productImageFlyHeight}px;
            
            `;

            document.body.append(productImageFly);

            const cartFlyLeft = cart.getBoundingClientRect().left;
            const cartFlyTop = cart.getBoundingClientRect().top;

            productImageFly.style.cssText = 
            `
            left: ${cartFlyLeft}px;
            top: ${cartFlyTop}px;
            width: 0px;
            height: 0px;
            opacity: 0;
            `;


            productImageFly.addEventListener('transitionend', function() {
                if (productButton.classList.contains('_fly')) {
                    productImageFly.remove();
                    updateCart(productButton, productId);
                    productButton.classList.remove('_fly');
                }
            });
        }
    }

    function updateCart (productButton, productId, productAdd = true) {
        const cart = document.querySelector('.cart-header');
        const cartIcon = cart.querySelector('.cart-header__icon');
        const cartQuantity = cartIcon.querySelector('span');
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
        const cartList = document.querySelector('.cart-list');

        //Добавляем
        if (productAdd) {
            if (cartQuantity) {
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            } else {
                cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
            }
            if (!cartProduct) {
                const product = document.querySelector(`[data-pid="${productId}"]`);
                const cartProductImage = product.querySelector('.item-product__image').innerHTML;
                const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
                const cartProductContent = `
                <a href="# #" class="cart-list__image _ibg">${cartProductImage}</a>
                <div class="cart-list__body">
                    <a href="# # " class="cart-list__title">${cartProductTitle}</a>
                    <div class="cart-list__quantity">Quantity: <span>1</span></div>
                    <a href="# #" class="cart-list__delete">Delete</a>
                </div>
                `;
                cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
            } 
            else {
                const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
                cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
            }

            productButton.classList.remove('_hold');
        } else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
            if (!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove();
            }

            const cartQuantityValue = --cartQuantity.innerHTML;

            if (cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue;
            } else {
                cartQuantity.remove();
                cartBody = document.querySelector('.cart-header__body');
                cartBody.classList.remove('_active');
            }
        }

        
    }

    if (document.querySelector('.slider-main__body')) {
        new Swiper('.slider-main__body', {
            observer: true,
            observerParents: true,
            slidesPerView: 1,
            spaceBetween: 32,
            watchOverFlow: true,
            speed: 800,
            loop: true,
            loopAdditionalSlides: 5,
            preloadImages: false,
            parallax: true,
            pagination: {
                el: '.controls-slider-main__dots',
                clickable: true,
            },
            navigation: {
                nextEl: '.slider-main .slider-arrow_next',
                prevEl: '.slider-main .slider-arrow_prev',
            }
        });
    };

    if (document.querySelector('.rooms__slider')) {
        new Swiper('.rooms__slider', {
            observer: true,
            observerParents: true,
            slidesPerView: 'auto',
            spaceBetween: 24,
            watchOverFlow: true,
            speed: 800,
            loop: true,
            loopAdditionalSlides: 5,
            preloadImages: false,
            parallax: true,
            centeredSlides: true,
            pagination: {
                el: '.slider-rooms__dots',
                clickable: true,
            },
            navigation: {
                nextEl: '.slider-rooms__arrows .slider-arrow_next',
                prevEl: '.slider-rooms__arrows .slider-arrow_prev',
            },
            breakpoints: {
                767: {
                    centeredSlides: false
                }
            }

        });
    }
    if (document.querySelector('.tips__slider')) {
        new Swiper('.tips__slider', {
            observer: true,
            observerParents: true,
            slidesPerView: 3,
            spaceBetween: 32,
            watchOverFlow: true,
            speed: 800,
            loop: true,
            pagination: {
                el: '.slider-tips__dots',
                clickable: true,
            },
            navigation: {
                nextEl: '.slider-tips__arrows .slider-arrow_next',
                prevEl: '.slider-tips__arrows .slider-arrow_prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.1,
                    spaceBetween: 15
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 32
                }
            }
        });
    }

    baguetteBox.run('._gallery');

    //furniture gallery
    const furniture = document.querySelector('.furniture__body');
    if (furniture && !isMobile.any()) {
        const furnitureItems = document.querySelector('.furniture__items');
        const furnitureColumn = document.querySelectorAll('.furniture__column');

        const speed = furniture.dataset.speed;

        let positionX = 0;
        let coordXprocent = 0;

        function setMouseGalleryStyle() {
            let furnitureItemsWidth = 0;
            furnitureColumn.forEach(element => {
                furnitureItemsWidth += element.offsetWidth;
            });

            const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
            const distX = Math.floor(coordXprocent - positionX);

            positionX = positionX + (distX * speed);
            let position = furnitureDifferent / 200 * positionX;

            furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

            if(Math.abs(distX) > 0) {
                requestAnimationFrame(setMouseGalleryStyle);
            } else {
                furniture.classList.remove('_init');
            }
        }

        furniture.addEventListener('mousemove', function (e) {
            const furnitureWidth = furniture.offsetWidth;

            const coordX = e.pageX - furnitureWidth / 2;

            coordXprocent = coordX / furnitureWidth * 200;

            if(!furniture.classList.contains('_init')) {
                requestAnimationFrame(setMouseGalleryStyle);
                furniture.classList.add('_init');
            }
        });
    }

    
    const inputs = document.querySelectorAll('input');
    if(inputs) {
        inputs.forEach(input => {
            input.setAttribute('placeholder', input.dataset.placeholder);
            input.addEventListener('focus', function() {
                input.setAttribute('placeholder', '')
            })
            input.addEventListener('blur', function() {
                input.setAttribute('placeholder', input.dataset.placeholder)
            })
        });
    }
    
}
