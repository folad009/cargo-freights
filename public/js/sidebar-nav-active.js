/**
 * Highlights the sidebar link that best matches the current URL (longest path prefix).
 */
(function ($) {
  "use strict";

  function normalizePath(p) {
    if (!p || p === "") return "/";
    var s = p.split("?")[0];
    if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
    return s || "/";
  }

  $(function () {
    var $side = $(".sidebar-nav-enhanced");
    if (!$side.length) return;

    var path = normalizePath(window.location.pathname);
    var best = null;
    var bestLen = -1;

    $side.find('a[href^="/"]').each(function () {
      var href = normalizePath($(this).attr("href") || "");
      if (href === "/" || href.indexOf("javascript:") === 0) return;
      if (path === href || path.indexOf(href + "/") === 0) {
        if (href.length > bestLen) {
          bestLen = href.length;
          best = this;
        }
      }
    });

    if (best) {
      var $a = $(best);
      $a.addClass("nav-current");
      var $sub = $a.closest(".sidebar-submenu");
      if ($sub.length) {
        $sub.css("display", "block");
        var $title = $sub.prev(".sidebar-title");
        if ($title.length) {
          $title.addClass("active");
          var $am = $title.find(".according-menu i");
          if ($am.length) {
            $am.removeClass("fa-angle-right").addClass("fa-angle-down");
          }
        }
      }
    }
  });
})(jQuery);
