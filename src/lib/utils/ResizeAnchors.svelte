<script lang="ts">
	let {
		x,
		y,
		width,
		height,
		rotation = 0,
		minSize = 10,
		resizeBoxBy
	}: {
		x: number;
		y: number;
		width: number;
		height: number;
		rotation?: number;
		minSize?: number;
		resizeBoxBy: (width: number, height: number, direction: string) => void;
	} = $props();

	let startX: number;
	let startY: number;
	let startWidth: number;
	let startHeight: number;

	function onMouseDown(event: MouseEvent, direction: string) {
		event.stopPropagation();
		startX = event.clientX;
		startY = event.clientY;
		startWidth = width;
		startHeight = height;

		const onMove = (e: MouseEvent) => {
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;

			if (direction.includes('e')) newWidth += dx;
			if (direction.includes('s')) newHeight += dy;
			if (direction.includes('w')) newWidth -= dx;
			if (direction.includes('n')) newHeight -= dy;

			newWidth = Math.max(minSize, newWidth);
			newHeight = Math.max(minSize, newHeight);

			resizeBoxBy(newWidth, newHeight, direction);
		};

		const onUp = () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		};

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	}
</script>

<div class="anchor nw" onmousedown={(e) => onMouseDown(e, 'nw')} role="button" tabindex="0"></div>
<div class="anchor ne" onmousedown={(e) => onMouseDown(e, 'ne')} role="button" tabindex="0"></div>
<div class="anchor sw" onmousedown={(e) => onMouseDown(e, 'sw')} role="button" tabindex="0"></div>
<div class="anchor se" onmousedown={(e) => onMouseDown(e, 'se')} role="button" tabindex="0"></div>

<style>
	.anchor {
		width: 10px;
		height: 10px;
		background: white;
		border: 1px solid black;
		position: absolute;
		z-index: 10;
		cursor: pointer;
	}

	.anchor.nw {
		cursor: nwse-resize;
		top: -5px;
		left: -5px;
	}
	.anchor.ne {
		cursor: nesw-resize;
		top: -5px;
		right: -5px;
	}
	.anchor.sw {
		cursor: nesw-resize;
		bottom: -5px;
		left: -5px;
	}
	.anchor.se {
		cursor: nwse-resize;
		bottom: -5px;
		right: -5px;
	}
</style>
