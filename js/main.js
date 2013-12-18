$(function () {
    $(".row").each(function (i) {
        $(this).attr("data-content", i + 1);
    }).addClass("active");
})
