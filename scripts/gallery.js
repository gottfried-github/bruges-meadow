function Flip(data, elements) {
/*
  var elements = {
    fwd: document.getElementById("fwd"),
    bwd: document.getElementById("bwd"),
    bottom: document.getElementById("bottom"),
    middle: document.getElementById("middle"),
    top: document.getElementById("top")
  }
*/

  // initialize
  this.top = $(elements.top);
  this.middle = $(elements.middle);
  this.bottom = $(elements.bottom);

  this.fwd = $(elements.fwd);
  this.bwd = $(elements.bwd);

  this.elements = [this.bottom, this.middle, this.top];
  var qty = data.length;

  this.flipStacks = {
    main: [
      { z: 1, name: 'bottom'},
      { z: 2, name: 'middle'},
      { z: 3, name: 'top'}
    ],
    chdirn: [
      {z: 3, name: 'top'},
      {z: 2, name: 'middle'},
      {z: 1, name: 'bottom'}
    ],
    nochdirn: [
      {z: 2, name: 'middle'},
      {z: 3, name: 'top'},
      {z: 1, name: 'bottom'}
    ]
  }

  this.next = (data) ? [].concat(data) : [];
  this.prev = [];
  this.buffer = (data) ? this.next.splice(0, 2) : [];

  var self = this;
  this.direction = 'fwd';
  this.dirChanged = (qty < 3) ? true : false;

  this.timer = {
    id: false,
    on: false,
    action: function() {},
    interruptable: true,
    interrupted: false,
    interrupted0: false
  }

  this.flexDisplay = {"display": "block"};
  this.listenFwd = true;
  this.listenBwd = true;

  // subscribe
  this.onHandleSwitch = function(dir) {
    this.handleSwitch(dir);
  }
  this.fwd.on('click', function(ev) { // touchstart

    if (self.listenFwd) {
      self.onHandleSwitch("fwd");
    }
  });
  this.bwd.on('click', function(ev) { // touchstart

    if (self.listenBwd) {
      self.onHandleSwitch("bwd");
    }
  });

  // ==============================================================
  // core functionality
  // ==============================================================
  this.flip = function() {
    console.log('flip')
    var stacksarr;

    if (!this.dirChanged) {
      stacksarr = this.flipStacks.nochdirn;
    } else if (this.dirChanged) {
      stacksarr = this.flipStacks.chdirn;
    }

    for (var i = 0; i < this.flipStacks.main.length; i++) {
      if (this.flipStacks.main[i].z == 1) {
        this.flipStacks.main[i] = stacksarr[0];
      } else if (this.flipStacks.main[i].z == 2) {
        this.flipStacks.main[i] = stacksarr[1];
      } else if (this.flipStacks.main[i].z == 3) {
        this.flipStacks.main[i] = stacksarr[2];
      }
    }

    for (var i = 0; i < this.elements.length; i++) {
      this[this.flipStacks.main[i].name] = this.elements[i];
      this[this.flipStacks.main[i].name].label = this.flipStacks.main[i].name;
      this[this.flipStacks.main[i].name].css('z-index', this.flipStacks.main[i].z);
    }
    this.doChain();
  }

  this.fetchData = function(el, doImport, data) {
    var element = (el) ? el : this.middle;
    var bufferSize = 3;
    var rawData;

    // arrange the data store according to the conditions
    if (this.direction === "fwd") {
      if (data) {
        bufferSize = 2;
        if (this.buffer.length > bufferSize) {
          this.prev.unshift(this.buffer.splice(0, 1)[0]);
        }
      } else {
        rawData = this.next[0];
        this.buffer.push(this.next.splice(0, 1)[0]);
        if (this.buffer.length > bufferSize) {
          this.prev.unshift(this.buffer.splice(0, 1)[0]);
        }
      }
    } else if (this.direction === "bwd") {
      if (data) {
        bufferSize = 2;
        if (this.buffer.length > bufferSize) {
          this.next.unshift(this.buffer.pop());
        }
      } else {
        rawData = this.prev[0];
        this.buffer.unshift(this.prev.splice(0, 1)[0]);
        if (this.buffer.length > bufferSize) {
          this.next.unshift(this.buffer.pop());
        }
      }
    }
    // console.log("next, fetchData", this.next)
    // console.log("prev, fetchData", this.prev)
    // console.log("buffer, fetchData", this.buffer)
    element.image = {url: rawData};

  }

  // ==============================================================
  // handling
  // ==============================================================

  this.handleSwitch = function(direction) {
    if (this.timer.on && !this.timer.interruptable) {
      return;
    }

    if (this.timer.on /* or (this.timerOn)*/) {
      window.clearTimeout(this.timer.id);
      this.timer.interrupted0 = true;

      // if action is 'one', then complete the current cycle and
      // proceed with the next immediately
      this.timer.action();
      this.timer.interrupted = true;
    }
    /*
    */
    var self = this;

    if ((this.direction === direction) && !(qty == 2)) {

      this.dirChanged = false;
      this.middle.removeClass("transparent")

      this.hide([this.top], direction);
    } else {
      this.dirChanged = true;
      this.direction = direction;

      this.bottom
        .removeClass("transit")
        .removeClass("transparent");

      this.hide([this.top, this.middle]);
    }
  }

  this.doChain = function() { // this is after hide and flip

    if ( (!this.dirChanged) ) {
      if (this.timer.interrupted) {
        this.top.removeClass("transparent");
      }
    } else {
      if (this.timer.interrupted) {
        // bottom opacity to 1 (it's not set before, in case of interruption)
      }
    }

    if (this.timer.interrupted0) {
      this.timer.interrupted0 = false;
    }

    if (this.timer.interrupted) {
      this.timer.interrupted = false;
    }
  }

  // ==============================================================
  // DOM operations
  // ==============================================================

  this.hide = function(elts, direction) {
    var self = this;
    this.top.addClass("transit");
    this.listenFwd = true;
    this.listenBwd = true;
    var dirlist = (this.direction === "fwd") ? this.next : this.prev;
    var oppdirlist = (this.direction === "bwd") ? this.next : this.prev;
    var arrow = (this.direction === "fwd") ? this.listenFwd : this.listenBwd;
    if (this.dirChanged) {
      this.middle.removeClass("transit")

      if (qty > 3) {
        if (dirlist.length == 0 && oppdirlist.length > 0) {
          if (this.direction === "fwd") {
            this.listenFwd = false;
          } else {
            this.listenBwd = false;
          }
          this.fetchData(this.middle, true, true);
        } else {
          this.fetchData(this.middle, true, false);
          this.loadIt(this.middle);
        }
      }
    } else {
      if (qty > 3) {
        if (dirlist.length == 0) {
          if (this.direction === "fwd") {
            this.listenFwd = false;
          } else {
            this.listenBwd = false;
          }
          this.fetchData(this.middle, true, true);
        } else {
          this.fetchData(this.bottom, true, false);
          this.loadIt(this.bottom);
        }
      }
    }

    for (var i = 0; i < elts.length; i++) {
      elts[i]
        .addClass("transparent")
    }

    this.timer.action = function() {
      for (var i = 0; i < elts.length; i++) { //elts[i]
        self.top
          .removeClass("transit")
          .removeClass("transparent")
      }
      self.timer.on = false;
      self.flip();
    }
    this.timer.interruptable = true;

    // flip the boards
    if (this.timer.interrupted && !this.timer.interrupted0) {
      this.timer.id = window.setTimeout(this.timer.action, 1050)
      this.timer.on = true;
    } else {
      this.timer.id = window.setTimeout(this.timer.action, 1050)
      this.timer.on = true;
    }
  };

  this.loadIt = function(el) {
    console.log("loadIt")
    el.children(".decorated")
      .on("load", function() {
        $(this).addClass("refreshIt");
      })
    el.children(".decorated")
      .removeClass("refreshIt")
      .attr("src", el.image.url )
  };
}
