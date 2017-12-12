$(document).ready(function() {

  var scrollElements = [];
  $(".section").each(function() {
    scrollElements.push($(this))
  });

  if ($(".contacts-section").length != 0) {
    scrollElements.push($(".contacts-section"));
  }

  if (window.location.pathname !== '/bruges-meadow/contact') {
    ScrollForestScroll.scrollForest(scrollElements, document.getElementById("arrow-up"));
  }

  frontRouter(function(routing) {
    $(".go-back_box.arrow-back .go-back_btn_wrap").attr("href", routing.backurl)
    /*
    .on("click touchend", function(ev) {
      ev.preventDefault();
      console.log(routing.backurl)
      window.location = routing.backurl
    })
    */

    $(".grid .img_wrap").each(function() {
      var url = $(this).attr("href"); //+ "&" +routing.url_fwd_int;
      var hash_index = url.search("#")
      if (hash_index != -1) {
        var hash = url.slice(hash_index)
          if (typeof(routing.url_fwd_int) !== 'undefined') {
            // if (window.location.pathname !== "bruges-meadows") {
            url = url.slice(0, hash_index)+  "&" +routing.url_fwd_int +hash;
            // }
          } else if (window.location.pathname === "/bruges-meadow/catalog" && typeof(routing.url_fwd_ext) !== 'undefined') {
            url = url.slice(0, hash_index)+  "&" +routing.url_fwd_ext +hash;
          } else {
            url = url.slice(0, hash_index) +hash;
          }
        }
        // console.log(url)
      } else {
        url += "&" +routing.url_fwd_int
        // console.log(url)
      }
      $(this).attr("href", url);
    })

    var contact = $("#contact");
    var contacthref = contact.attr('href')+ "?" +routing.url_fwd_ext;
    contact.attr('href', contacthref);

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
