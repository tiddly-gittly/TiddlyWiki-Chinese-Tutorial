(function(){
	"use strict";
	if (typeof window !== 'undefined' && window.document) {
		var sidebarResizerNode = null;
		var canResize = false;
		$tw.hooks.addHook('th-page-refreshed', function() {
			if (sidebarResizerNode&&sidebarResizerNode.ownerDocument.contains(sidebarResizerNode)) return;
			var body = document.querySelector('body');
			if (!body) return;
			sidebarResizerNode = document.querySelector('#gk0wk-sidebar-resize-area');
			if (!sidebarResizerNode) return;
			canResize = false;
			sidebarResizerNode.addEventListener('mousedown', function() { canResize = true; });
			body.addEventListener('mouseup', function() { canResize = false; });
			body.addEventListener('blur', function() { canResize = false; });
			body.addEventListener('mousemove', function() {
				if (!canResize) return;
				var widthPercent = 100 - (event.clientX / window.innerWidth) * 100;
				if (widthPercent > 80) return;
				if ((window.innerWidth - event.clientX) < 100) {
					$tw.wiki.setText('$:/themes/tiddlywiki/vanilla/metrics/sidebarwidth', null, null, (30000 / window.innerWidth) + 'vw');
					$tw.wiki.setText('$:/state/sidebar', null, null, 'no');
					canResize = false;
					return;
				}
				$tw.wiki.setText('$:/themes/tiddlywiki/vanilla/metrics/sidebarwidth', null, null, widthPercent + 'vw');
			});
		});
	}
})();
