;(function(win) {

  win.BackToSIGHTS = {}

  function create(title, target) {
    title = title || '< Back to SIGHTS'
    target = target || (() => { window.close(); })

    win.BackToSIGHTS.target = target

    function generateHeader(title) {
      return "<a href='#' onclick='BackToSIGHTS.onClick(event)' class='back-button'>" + title + "</a>";
    }

    return function(hook, vm) {
      win.BackToSIGHTS.onClick = function(event) {
        BackToSIGHTS.target(event, vm)
      }

      hook.mounted(function () {
        // Get IP address or hostname
        var ip = window.location.hostname;
        // Only execute on local networks. Hardly foolproof, but it'll do the job
        if (!ip.includes("github") && !ip.includes(".com") && !ip.includes(".io"))
          // Only show if we came to this page from SIGHTS
          if (window.location.origin + "/" == document.referrer) {
            // Create HTML for button
            var header = generateHeader(title, target)
            // Create a new DOM element
            var e = document.createElement('span');
            // Put the HTML into the new element
            e.innerHTML = header
            // Insert element into sidebar
            document.getElementsByClassName('sidebar')[0].appendChild(e);
          }
      })
    }
  }

  win.BackToSIGHTS.create = create
}) (window)
