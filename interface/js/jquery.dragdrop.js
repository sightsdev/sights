/**
 * DragDrop.js
 *
 * A JavaScript micro-framework for adding drag-and-drop functionality
 * to elements for advanced UI development.
 *
 * @author     James Brumond
 * @version    0.3.0
 * @copyright  Copyright 2011 James Brumond
 * @license    Dual licensed under MIT and GPL
 */
 (function() {

	$.fn.dragdrop = function(opts) {
		opts = opts || { };
		
		var bindings = [ ];
		this.each(function() {
			var options = $.extend({ }, opts);
			if (typeof options.anchor === 'string') {
				options.anchor = $(options.anchor, this)[0];
			}
			bindings.push(DragDrop.bind(this, options));
		});

		return {
			unbind: function() {
				for (var i = 0, c = bindings.length; i < c; i++) {
					DragDrop.unbind(bindings[i]);
				}
			}
		};
	};

}());
