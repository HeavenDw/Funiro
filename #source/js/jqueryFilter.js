$('.filter__link').click(function() {
		var i = $(this).data('filter');
		if(i == 1){
			$('.portfolio__col').show();
		}else{
			$('.portfolio__col').hide();
			$('.f_' + i).show();
		}
		$('.filter__link').removeClass('active');
		$(this).addClass('active');
		return false;
	});


// фильтр с багетбоксом
// $('.filter__link').click(function() {
// 		var i = $(this).data('filter');
// 		if(i == 1){
// 			$('.portfolio__col').show();
// 			$('.portfolio__item').removeClass('ignore');
// 		}else{
// 			$('.portfolio__col').hide();
// 			$('.portfolio__item').addClass('ignore');
// 			$('.f_' + i).show();
// 			$('.f_'+i+'>a').removeClass('ignore');
// 		}
// 		$('.filter__link').removeClass('active');
// 		$(this).addClass('active');
// 		baguetteBox.run('.gallery', {
// 		    ignoreClass: 'ignore'
// 		});
// 		return false;
// 	});