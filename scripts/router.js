/*
@a is either:
  an object containing the two types of elements: fwdurls and bwdurls;
or:
  a function, that handles elements selection and subscrition to events
*/

function frontRouter(a) {

  var req = {
    query: query(window.location.search),
    path: window.location.pathname
  }

  req = doFrontRouter(req);

  if (typeof(a) === "function") {
    a(req.routing);
  } else {
    // loop through given elements
  }
}

function doFrontRouter(req) {

  // the prevpage property is central to this module. If there's no prevpage -
  // there's no route.
  if (req.query && req.query.pages) {
    var pages = req.query.pages.split("+")

    var routing = {
      pages: req.query.pages,
      path: req.path
    };

    var prevpage = pages[0];
    console.log("rouer ", req.path, prevpage)
    if (prevpage === req.path) {
      pages.shift();

      // fwd urls:
      if (req.path != "/contact") {
        pages_fwd = [].concat(pages)
        pages_fwd.unshift(req.path)
        //routing.fwdparams = "pprevpage=" +req.query.pprevpage+ "&prevpage=" +req.query.prevpage

        var params_fwd = "";
        var itemsfwdparams = "";

        if (req.query.prevhash) {
          params_fwd += "prevhash=" +req.query.prevhash
        }

        // on /item page, on urls of items we don't need the pdct property,
        // since items have each it's own pdct property
        if (req.path === "/item") {
          itemsfwdparams += params_fwd;
        }
        // if (req.query.pdct) {
        //   routing.fwdparams += "&pdct=" + req.query.pdct;
        // }

        var pagesstr = listtostr(pages_fwd);
        routing.itemsfwdparams = "pages=" +pagesstr+ "&" +itemsfwdparams
        routing.url_fwd_ext = "pages=" +pagesstr+ "&" +params_fwd;
        routing.url_fwd_int = "pages=" +pagesstr;
      }

      // bwds
      prevpage = pages.shift()
      routing.backurl = prevpage

      var params = ""

      if (req.query.prevhash) {
        params += buildurlparams(params, "prevhash=" + req.query.prevhash + "#" + req.query.prevhash)
        routing.prevhash = req.query.prevhash;
      } else {
        // this theoretically shouldn't happen
      }

      routing.backurl += "?pages=" +listtostr(pages, "+")+ "&" +params;
    } else {

      /*
      >>>>>>>>>>>> we create forward-direction urls <<<<<<<<<<<<<<<<<<<<<<<<<<
      */

      // if we've arrived on /contact, then if we go further from here,
      // we don't need to come back here and we don't need to remember the history anymore
      // we will eventually determine what these pages are by analyzing the provided
      // graph of the urls
      if (req.path != "/contact") {
        pages_fwd = [].concat(pages)
        pages_fwd.unshift(req.path)
        pages_fwd = listtostr(pages_fwd, "+");
        // ro_uting.fwdparams = "pprevpage=" +req.query.prevpage+ "&prevpage=" +req.path

        var params_fwd = ""
        var itemsfwdparams = ""

        // var params_fwd_int = ""
        if (req.query.prevhash) {
          params_fwd += "prevhash=" +req.query.prevhash
        }

        // on /item page, on urls of items we don't need the pdct property,
        // since items have each it's own pdct property
        if (req.path === "/item") {
          itemsfwdparams += params_fwd;
        }

        if (req.query.pdct) {
          params_fwd += "&pdct=" + req.query.pdct;
        }

        routing.itemsfwdparams = "pages=" +pages_fwd+ "&" +itemsfwdparams
        routing.url_fwd_ext = "pages=" +pages_fwd+ "&" +params_fwd;
        routing.url_fwd_int = "pages=" +pages_fwd;
      }

      /*
      >>>>>>>>>>>> we create backward-direction url (back button) <<<<<<<<<<<<<<<<<<<<<<<<<<
      */
      prevpage = pages.shift();
      routing.backurl = prevpage

      var params = "";

      if (prevpage === "/item" && req.query.pdct) {
        params += "pdct=" + req.query.pdct;
      }

      if (req.query.prevhash) {
        params = buildurlparams(params, "prevhash=" + req.query.prevhash)
        params += "#" + req.query.prevhash;
        routing.prevhash = req.query.prevhash;
      } else {
        // this theoretically shouldn't happen
      }

      if (pages.length > 0) {
        routing.backurl += "?pages=" +listtostr(pages, "+")+ "&" +params;
      } else {
         routing.backurl += "?" +params;
      }
    }

    // routing.backurl += "?" +params;
    req.routing = routing;
  } else {
    req.routing = {
      backurl: "/",
      url_fwd_ext: "pages="+ req.path
    }

    if (req.query && req.query.prevhash) {
      req.routing.backurl += "#" + req.query.prevhash
    }
    // routing.outparams = "prevpage=" + req.path + "&prevhash="+ req.query.prevhash;
  }

  return req;
  // if there is prevhash, but no prevpage - which could only happen if someone's visiting from web
  // (and even then I for now don't see how that could happen (someone would have to manually erase
  // the prevpage part from the link)) - we just go "home"

}

function query(string) {
  string = string.substr(1);
  var arr = string.split("&")
  var query = {};

  for (var i = 0; i < arr.length; i++) {
    if (typeof(arr[i]) !== "string")
      return "array["+ i +"] is not a string"
    var pair = arr[i].split("=")
    query[pair[0]] = pair[1];
  }
  return query;
}

function buildurlparams(params, param) {
  if (params === "") {
    params += param
  } else {
    params += "&" +param
  }
  return params
}

function listtostr(list, sm /*separating mark*/) {
  if (!sm)
    sm = "+"
  var string = "";
  for (var i = 0; i < list.length; i++) {
    if (list.length <= 1 || i == (list.length -1)) {
      string += list[i]
    } else {
      string += list[i]+ sm
    }
  }
  return string
}

function maptostr(map) {
  var params = Object.keys(map);
  if (params.length > 0) {
    map.string = "";
    for (k = 0; k < params.length; k++) {
      if (params.length <= 1 || k == (params.length -1)) {
        map.string += params[k]+ "=" +map.query[params[k]]
      } else {
        map.string += params[k]+ "=" +map.query[params[k]]+ "&"
      }
    }
  }
  return map;
}
