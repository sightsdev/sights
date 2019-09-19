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
	
	$("#sshModal").on('shown.bs.modal', function () {
		focusCurrentSsh(); // Focus the current SSH iframe on modal open
		// Set the src of the modal on first load only
		if ($("#ssh_iframe_1").attr("src") == "") {	// Prevent refresh every time the modal is loaded
			$("#ssh_iframe_1").attr("src", "https://gitsuppository.net");
		}
	});

	// Create a new SSH terminal
	$("#ssh-new-button").click(function () {
		//Hide the current terminal and deactivate current button
		$("#ssh_iframe_" + ssh_current).hide();
		$("#ssh-tab-" + ssh_current).removeClass("active");
		
		//Update counts
		ssh_count ++;
		ssh_current = ssh_count;
		
		//Create a new iframe
		$(".ssh-container").append($("#ssh_iframe_1").clone().attr("id","ssh_iframe_" + ssh_count));
		$("#ssh_iframe_" + ssh_current).show();
		
		//Create a button for the new terminal
		let new_tab = $("#ssh-tab-1").clone(); 				//Clone existing button
		new_tab.html(function(n,content){ 						//Set last html character to new number
			return content.substr(0,content.length - 1) + ssh_current;
		});
		new_tab.attr("id", "ssh-tab-" + ssh_current); 		//Set id
		new_tab.addClass("active");
		$(".ssh-tab-container").append(new_tab);
		
		//Load the new SSH terminal
		$("#ssh_iframe_" + ssh_current).attr("src", "https://gitsuppository.net");
		
		//Focus back on the new SSH terminal
		focusCurrentSsh();
		
		//Limit to max_ssh_terminals active terminals
		if (ssh_count >= max_ssh_terminals) {
			$("#ssh-new-button").attr("disabled",true);
		}
	});
	
	// Switch to another terminal
	$(".ssh-tab-container").click(function(){
		$("#ssh_iframe_" + ssh_current).hide();
		$("#ssh-tab-" + ssh_current).removeClass("active");
		ssh_current = event.target.closest(".ssh-tab").getAttribute("id").slice(-1);
		$("#ssh_iframe_" + ssh_current).show();
		$("#ssh-tab-" + ssh_current).addClass("active");
		focusCurrentSsh();
	});
});