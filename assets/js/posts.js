$(document).ready(function() {

	let itemHeight = new Array();

	jQuery.showCatalog = function(dom) {
		let elems = $('.left').children();
		let wrapper = $('.page-catalog');
		let id = 0;
		elems.map(function(index, item) {
			let _tag = item.tagName;
			let pattern = /^H[1-6]/;
			if(pattern.test(_tag)) {

				let _layer = item.tagName.slice(1, 2);
				var _p = $("<p class=tab" + _layer +  "></p>");
				$(_p).addClass("tab");
				$(_p).attr("data-id", "menuID" + id);
				$(_p).text($(item).text());
				$(_p).click(function() {
					let _item = $("#" + $(this).data("id"));
					$.scrollTo($(_item));
				});
				dom.append(_p);

				$(item).attr("id", "menuID" + id ++);

				itemHeight.push($(item).offset().top);
			}
		});
	}

	$.showCatalog($('.page-catalog'));

	jQuery.scrollTo = function(dom) {
		let height = dom.offset().top;
		$('html, body').animate({
			scrollTop: height,
		},500);
	};

	const catalogHeight = $('.page-catalog').offset().top;
	let preTop;
	let nowTop;
	$(window).scroll(function(e){
		let scrollTop = $(document).scrollTop();
		let nowItem = 0;
		itemHeight.map(function(item, index) {
			if(scrollTop > item) {
				nowItem = index + 1;
			}
		});

		$('.tab').eq(nowItem).addClass('on').siblings().removeClass('on');


		if(scrollTop < catalogHeight) {
			$('.page-catalog').removeClass('absolute');
		} else {
			$('.page-catalog').addClass('absolute');
		}
		// console.log(scrollTop + "   " + catalogHeight);
		jQuery.showBackUp = (function (){
            nowTop = $(window).scrollTop();
			if(nowTop > preTop && scrollTop > catalogHeight) {
				$('.back-top').css('display', ' block');
            } else {
            	$('.back-top').hide(1000);
            }
            preTop = nowTop;

        })();
	});

	$('.back-top').click(function() {
		$('html, body').animate({
			scrollTop: 0,
		},500);
	});
});