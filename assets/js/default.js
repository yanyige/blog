$(document).ready(function() {

	let itemHeight = new Array();

	jQuery.showNav = function() {
		$('.menu-icon').click(function() {
			if($('.nav-right').is(':visible')) {
				$('.nav-right').fadeOut();
			} else {
				$('.nav-right').fadeIn();
			}
		});
	}
	$.showNav();

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
				$(_p).text($(item).find("a").text());
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

	if($('.page-catalog').length) {
		$.showCatalog($('.page-catalog'));
	}

	jQuery.scrollTo = function(dom) {
		let height = dom.offset().top;
		$('html, body').animate({
			scrollTop: height,
		},500);
	};

	let preTop;
	let nowTop;
	if($('.page-catalog').length) {
		var catalogHeight = $('.page-catalog').offset().top;
	}
	$(window).scroll(function(){
		nowTop = $(window).scrollTop();
		let scrollTop = $(document).scrollTop();
		let nowItem = 0;
		itemHeight.map(function(item, index) {
			if(scrollTop > item) {
				nowItem = index + 1;
			}
		});

		$('.tab').eq(nowItem).addClass('on').siblings().removeClass('on');


		if($('.page-catalog').length) {
			if(scrollTop < catalogHeight) {
				$('.page-catalog').removeClass('absolute');
			} else {
				$('.page-catalog').addClass('absolute');
			}

		// console.log(scrollTop + "   " + catalogHeight);
			jQuery.showBackUp = (function (){
				if(nowTop > preTop && scrollTop > catalogHeight) {
					$('.back-top').css('display', ' block');
	            } else {
	            	$('.back-top').hide(1000);
	            }
	        })();
	    }

        // jQuery.navOpacity = (function() {
	       //  scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
	       //  var targetHeight = $('.page-header').outerHeight();
	       //  var opacity = (1 - (targetHeight - scrollHeight) / targetHeight);
	       //  opacity = opacity == 0 ? 0:1;
	       //  if(scrollHeight) {
	       //  	$('.nav-header').css('color', 'black');
	       //  	$('.nav-header').css('background-color', 'rgba(255, 255, 255, '+opacity+')');
	       //  } else {
	       //  	$('.nav-header a').css('color', 'white');
	       //  	$('.nav-header').css('background', 'transparent');
	       //  }
        // })();


        if(scrollTop == 0) {
        	if(!$('.nav-header').hasClass('show-top')){
        		$('.nav-header').removeClass('show-bottom').removeClass('show-medium').addClass('show-top');
        	}
        } else if(scrollTop < $('.page-header').outerHeight()) {
        	$('.nav-header').removeClass('show-top').removeClass('show-bottom').addClass('show-medium');
        } else {
        	if(!$('.nav-header').hasClass('show-bottom')){
        		$('.nav-header').removeClass('show-top').removeClass('show-medium').addClass('show-bottom');
        	}
        }

        preTop = nowTop;
	});

	$('.back-top').click(function() {
		$('html, body').animate({
			scrollTop: 0,
		},500);
	});
});