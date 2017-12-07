$(document).ready(function() {

  var scrollElements = [];
  $(".section").each(function() {
    scrollElements.push($(this))
  });

  if ($(".contacts-section").length != 0) {
    scrollElements.push($(".contacts-section"));
  }

  ScrollForestScroll.scrollForest(scrollElements, document.getElementById("arrow-up"));

  frontRouter(function(routing) {
    $(".go-back_box.arrow-back .go-back_btn_wrap").attr("href", routing.backurl)
    /*
    .on("click touchend", function(ev) {
      ev.preventDefault();
      console.log(routing.backurl)
      window.location = routing.backurl
    })
    */

    $(".grid .img_wrap").on("click touchend", function(ev) {
      ev.preventDefault();
      var url = $(this).attr("href"); //+ "&" +routing.url_fwd_int;
      var hash_index = url.search("#")
      if (hash_index != -1) {
        var hash = url.slice(hash_index)
        url = url.slice(0, hash_index)+  "&" +routing.url_fwd_int +hash;
        console.log(url)
      } else {
        url += "&" +routing.url_fwd_int
        console.log(url)
      }

      window.location = url;
    })

    $("#contact").on("click touchend", function(ev) {
      ev.preventDefault();
      console.log($(this).attr("href")+ "?" +routing.url_fwd_ext)
      window.location = $(this).attr("href")+ "?" +routing.url_fwd_ext
    })
    console.log(routing)
  });

  $(window).on("resize", function() {
    manageHeight();
  })
  manageHeight();

})

function manageHeight() {
  if (window.innerWidth <= 600) {
    $("#home").css("height", $("#home").css("height"))
  } else {
    $("#home").css("height", "100vh")
  }
}
