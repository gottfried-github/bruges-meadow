var ScrollForestScroll = {
  scrollForest: function(elements, listener) {
    listener.toggle = true;
    listener.maxScroll = $(document).height() - $(window).height() - 10;
    listener.currentScroll = undefined;
    listener.elements = undefined;
    listener.elements = elements;
    listener.onscroll = this.onscroll
    var self = this;
    $(window).on("scroll", function() {
      listener.onscroll.call(listener)
    });
    $(listener).on("click", this.doScroll);
  },
  doScroll: function() {
    // console.log("doScroll", this)
    this.currentScroll = $("html").get(0).scrollTop;
    this.maxScroll = $(document).height() - $(window).height() - 10;
    var self = this;
    if (this.currentScroll >= this.maxScroll) {
      $(window).off("scroll");
      return $('html, body').animate({
        scrollTop: 0
      }, 1000, function() {
        // console.log("rollback complete cb: ", this)
        $(".arrow_rotating").removeClass("arrow_rotated");
        self.toggle = true;
        $(window).on("scroll", function() {
          self.onscroll.call(self)
        })
      });
    } else if (this.currentScroll >= Math.floor(this.elements[this.elements.length-1].offset().top)) {
      return $('html, body').animate({
        scrollTop: this.maxScroll
      }, 500);
    } else {

      for (var i = 0; i < this.elements.length; i++) {
        var elOffset = Math.floor(this.elements[i].offset().top)
        // console.log("doScroll", this.currentScroll, elOffset)
        if (this.currentScroll < elOffset) { //  || currentScroll < elOffset + 7
          return $('html, body').animate({
            scrollTop: elOffset
          }, 500);
        }
      }
      // console.log("doScroll", this.currentScroll, elOffset)

    }
  },
  onscroll: function() {
    // console.log("scrollingBuddyScrolling", this)
    if (window.scrollY >= this.maxScroll) {
      // console.log("scrollingBuddyScrolling, window.scrollY >= this.maxScroll")
      if (this.toggle) {
        $(".arrow_rotating").addClass("arrow_rotated");
        this.toggle = false;
      }
    } else { // if (window.scrollY <= 10)
      // console.log("scrollingBuddyScrolling,else")
      if (!this.toggle) {
        $(".arrow_rotating").removeClass("arrow_rotated");
        this.toggle = true;
      }
    }
  }
}
