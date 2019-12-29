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

      var header = generateHeader(title, target)
      var e = document.createElement('span');
      e.innerHTML = header

      var ip = window.location.hostname;

      hook.mounted(function () {
        // Only execute on local networks. Hardly foolproof, but it'll do the job
        if (!ip.includes("github") && !ip.includes(".com") && !ip.includes(".io"))
          document.getElementsByClassName('sidebar')[0].appendChild(e);
      })
    }
  }

  win.BackToSIGHTS.create = create
}) (window)
