/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

var ssh_count = 1;
var ssh_current = 1;
	
function focusCurrentSsh() {
	setTimeout(function() {
		$("#ssh_iframe_" + ssh_current).focus();
	}, 200);
}

var ssh_tab_icon='<i class="fa fa-fw fa-terminal"></i> ';

$(document).ready(function() {
    $('#ssh-new-tab').click(function() {
		ssh_count++;
		let iframe_url = $("#ssh_iframe_1").attr("src"); // We know the correct URL exists in iframe 1 - use it.
		
		// Create the tab and terminal
		$('#ssh-term-list').append('<li class="nav-item" id="ssh-tab-'+ ssh_count +'"><a class="nav-link text-dark" href="#ssh-term-' + ssh_count + '" role="tab" data-toggle="tab" aria-selected="true">' + ssh_tab_icon + ssh_count + '</a></li>');
        $('#ssh-term-content').append($('<div class="tab-pane fade" id="ssh-term-' + ssh_count + '"><iframe id="ssh_iframe_'+ ssh_count +'" src="'+ iframe_url +'" width="100%" height="400px"></iframe></div>'));
    });

    var list = document.getElementById("ssh-term-list");
	
	$("#sshModal").on('shown.bs.modal', function () {
		focusCurrentSsh(); // Focus the current SSH iframe on modal open
		// Set the src of the modal on first load only
		if ($("#ssh_iframe_1").attr("src") == "") {	// Prevent refresh every time the modal is loaded
			$("#ssh_iframe_1").attr("src", portString(4200));
		}
	});
	
	// Refresh terminal
	$("#ssh-refresh-button").click(function () {
		$("#ssh_iframe_" + ssh_current).attr("src", $("#ssh_iframe_" + ssh_current).attr("src"));
		focusCurrentSsh();
	});
	
	// Focus the SSH terminal when the user switches tabs
	$("#ssh-term-list").click(function(){
		ssh_current = event.target.closest(".nav-item").getAttribute("id").replace(/[^0-9\.]/g, '');
		focusCurrentSsh();
	});
});
