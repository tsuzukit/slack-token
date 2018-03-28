
function main() {

  (function () {

      // CounterUp
  	$(document).ready(function( $ ) {
  		if($("span.count").length > 0){
  			$('span.count').counterUp({
  					delay: 10, // the delay time in ms
  			time: 1500 // the speed time in ms
  			});
  		}
  	});

}());

}
main();