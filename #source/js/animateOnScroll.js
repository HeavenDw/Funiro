const animItems = document.querySelectorAll('._anim-item');
if(animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll(params) {
		for (var i = animItems.length - 1; i >= 0; i--) {
			const animItem = animItems[i]
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4;

			var animItemPoint = window.innerHeight - animItemHeight / animStart;
			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			};

			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_fade');
			};
		};
	};

	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
	};
	animOnScroll();
};