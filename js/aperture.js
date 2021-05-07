$('.aperture').css({
	'margin-left': -window.innerWidth /2,
    'margin-top': -window.innerWidth /2,
    width: window.innerWidth,
    height: window.innerWidth
})

$('.aperture-part').css({
    width: window.innerWidth ,
    height: window.innerWidth
})

setApertureClosed();

function setApertureClosed(){
	var index = 1;
	$('.aperture-part').each(function(){

		var angle = 360 / 8 * index;
		var size = window.innerWidth;

		var origin = (Math.cos(angle)*(size/2) +size/2) +'px ' + (Math.sin(angle)*(size/2)+size/2)+'px';

		$('.aperture-part.number-'+index).css({
			top: Math.sin(angle)*(size/2),
			left: Math.cos(angle)*(size/2),
			'transform-origin': origin,
			'-webkit-transform-origin': origin
		})
		/*
		transform-origin(cos($angle)*($size/2) +$size/2 ,sin($angle)*($size/2)+$size/2 );

		$y: sin($angle)*($size/2);
	      $x: cos($angle)*($size/2);

	      top: $y;
	      left: $x;

	      @include transform-origin(cos($angle)*($size/2) +$size/2 ,sin($angle)*($size/2)+$size/2 );
	    }
		 */
		index ++;
	})
}

function openAperture(){

	$('.message').fadeOut('fast');
	var index = 1;
	$('.aperture-part').each(function(){

		var angle = 360 / 8 * index;

		$('.aperture-part.number-'+index).css({
			'transform': 'rotate(180deg))',
			'-webkit-transform': 'rotate(180deg)'
		})

		index ++;
	})
}

function closeAperture(){
	var index = 1;
	$('.aperture-part').each(function(){

		var angle = 360 / 8 * index;

		$('.aperture-part.number-'+index).css({
			'transform': 'rotate(0deg))',
			'-webkit-transform': 'rotate(0deg)'
		})

		index ++;
	})
}