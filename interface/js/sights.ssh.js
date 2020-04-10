/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

var ssh_count = 1;
var ssh_current = 1;
var ssh_address = "http://" + window.location.hostname + ":4200";

function setCurrentSsh(tab) {
	ssh_current = tab.attr("ssh_tab");
}

function closeSshTab(tab) {
	let tab_id = tab.attr("ssh_tab");
	$("#ssh_tab_" + tab_id).remove();
	$("#ssh_term_" + tab_id).remove();
	let tabActive = false;
	// If another tab is currently selected, set ssh_current
	$(".ssh-tab").each(function () {
		if ($(this).children('a').first().hasClass("active")) {
			setCurrentSsh($(this).children('a').first());
			tabActive = true;
		}
	});
	// Set a new current tab if there wasn't another already selected
	if (!tabActive) {
		$(".ssh-tab").first().find("a").addClass("active");
		$(".ssh-term").first().addClass("active show");
	}
}


$(document).on("ready", function () {
    $('#ssh_new_tab').on("click", function () {
		ssh_count++;
		
		// Get ready to go to the new tab. Make sure no other tab is shown.
		$(".ssh-tab").each(function () {
			$(this).children('a').first().removeClass("active");
		});
		$(".ssh-term").each(function () {
			$(this).removeClass("active");
			$(this).removeClass("show");
		});

		ssh_current = ssh_count;
		
		// Create the tab and terminal
		$('#ssh_new_tab').before('<li class="nav-item ssh-tab" id="ssh_tab_'+ ssh_current +'"><a class="nav-link text-dark active" ssh_tab="' + ssh_current + '" href="#ssh_term_' + ssh_current + '" role="tab" data-toggle="tab" aria-selected="true" onclick="setCurrentSsh($(this));"><i class="fa fa-fw fa-terminal"></i> ' + ssh_current + '<span style="padding-right: 1em"></span><span ssh_tab="' + ssh_current + '" id="ssh_tab_close_' + ssh_current + '" onclick="closeSshTab($(this));">&times</span></a></li>');
        $('#ssh_term_content').append($('<div class="tab-pane fade active show ssh-term" id="ssh_term_' + ssh_current + '"><iframe id="ssh_iframe_'+ ssh_current +'" src="" width="100%" height="400px" class="rounded-bottom ssh-iframe"></iframe></div>'));
		$("#ssh_iframe_" + ssh_current).attr("src", ssh_address);
    });
	
	$("#ssh_modal").on('shown.bs.modal', function () {
		// Set the src of the modal on first load only
		if ($("#ssh_iframe_1").attr("src") == "") {	// Prevent refresh every time the modal is loaded
			$("#ssh_iframe_1").attr("src", ssh_address);
		}
	});
	
	// Refresh terminal
	$("#ssh_refresh_button").on("click", function () {
		$("#ssh_iframe_" + ssh_current).attr("src", $("#ssh_iframe_" + ssh_current).attr("src"));
	});
});
