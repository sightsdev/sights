/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

var ssh_count = 1;
var ssh_current = 1;
var max_ssh_terminals = 7;
	
function focusCurrentSsh() {
	setTimeout(function() {
		$("#ssh_iframe_" + ssh_current).focus();
	}, 200);
}
	
$(document).ready(function () {
	// Set the src of the modal on first load only
	$("#sshModal").on('shown.bs.modal', function () {
		focusCurrentSsh();
		// Prevent refresh everytime the modal is loaded
		if ($("#ssh_iframe_1").attr("src") == "") {
			$("#ssh_iframe_1").attr("src", "https://gitsuppository.net");
		}
	});

	// Create a new SSH terminal
	$("#ssh-new-button").click(function () {
		//Hide the current terminal
		$("#ssh_iframe_" + ssh_current).hide();
		
		//Update counts
		ssh_count ++;
		ssh_current = ssh_count;
		
		//Create a new iframe
		$(".ssh-container").append('<iframe id="ssh_iframe_' + ssh_current + '" src="" width="100%" height="400px"></iframe>');
		
		//Create a button for the new terminal
		$(".ssh-button-container").append('<button type="button" class="btn btn-outline-dark" id="ssh-switch-button" number=' + ssh_current + '><i class="fa fa-fw fa-terminal"></i> ' + ssh_current + '</button>');
		
		//Load the new SSH terminal
		$("#ssh_iframe_" + ssh_current).attr("src", "https://gitsuppository.net");
		
		//Focus back on the new SSH terminal
		focusCurrentSsh();
		
		//Limit to max_ssh_terminals active terminals
		if (ssh_count >= max_ssh_terminals) {
			$("#ssh-new-button").attr("disabled",true);
		}
	});
	
	$(".ssh-button-container").on('click', 'button', function(){
		$("#ssh_iframe_" + ssh_current).hide();
		ssh_current = this.getAttribute("number");
		$("#ssh_iframe_" + ssh_current).show();
		focusCurrentSsh();
	});
});