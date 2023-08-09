$(document).ready(function () {

	$(".content1").slice(0, 3).show();
	$(".content1").slice(0, 3);
	$("#user_more").on("click", function (e) {
		e.preventDefault();
		$(".content1:hidden").slice(0, 1).slideDown();
		if ($(".content1:hidden").length == 0) {
			$("#user_more").text("No Content").addClass("noContent");
		}
	});

	$('.grid').isotope({
		itemSelector: 'masonry',
		masonry: {
			columnWidth: 100,
			gutter: 5
		}
	});

});

