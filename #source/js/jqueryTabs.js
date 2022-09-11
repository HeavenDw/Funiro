$('.tab-programm__top').click(function(event) {
	if($('.programm__tabs').hasClass('one')){
		$('.tab-programm__top').not($(this)).removeClass('_active');
		$('.tab-programm__body').not($(this).next()).slideUp(300);
	}
	$(this).toggleClass('_active').next().slideToggle(300);
});

function openTabOnLoad() {
	if ($('.tab-programm__body').hasClass('open-on-load')) {
		$('.tab-programm__body.open-on-load').css({'display': 'block'});
		$('.tab-programm__body.open-on-load').prev().addClass('_active');
	};
};

openTabOnLoad();
