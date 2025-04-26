<script lang="ts">
	let {
		x = $bindable(),
		y = $bindable(),
		width = $bindable(),
		height = $bindable(),
		rotation = $bindable(),
		minSize = 10,
		resizeBoxBy = () => {}
	}: {
		x: number;
		y: number;
		width: number;
		height: number;
		rotation?: number;
		minSize?: number;
		resizeBoxBy?: (
			width: number,
			height: number,
			direction: string,
			newX: number,
			newY: number
		) => void;
	} = $props();

	// Resizing
	let startX: number;
	let startY: number;
	let startWidth: number;
	let startHeight: number;

	// Rotation
	let rotating = false;
	let centerX: number;
	let centerY: number;
	let startRotation: number;
	let startMouseAngle: number;

	$effect(() => {
		//console.log(rotation);
	});

	
	function r2d(r: number) {
		return r * (180 / Math.PI);
	}

	function atan2ToDegreesPositive(dy: number, dx: number): number {
		let radians = Math.atan2(dy, dx);
		let degrees = r2d(radians);

		if (degrees < 0) {
			degrees += 360;
		}

		return degrees;
	}

	function startRotate(event: MouseEvent) {
		event.stopPropagation();
		rotating = true;

		centerX = x + width / 2;
		centerY = y + height / 2;

		const dx = event.clientX - centerX;
		const dy = event.clientY - centerY;

		startMouseAngle = Math.atan2(dy, dx);
		startRotation = rotation ?? 0;

		window.addEventListener('mousemove', onRotate);
		window.addEventListener('mouseup', stopRotate);
	}

	function onRotate(event: MouseEvent) {
		if (!rotating) return;

		const dx = event.clientX - centerX;
		const dy = event.clientY - centerY;
		const currentMouseAngle = Math.atan2(dy, dx);
		console.log(atan2ToDegreesPositive(dx, dy));

		let deltaAngle = (currentMouseAngle - startMouseAngle) * (180 / Math.PI); // radians to degrees

		rotation = startRotation + deltaAngle;
	}

	function stopRotate() {
		rotating = false;
		window.removeEventListener('mousemove', onRotate);
		window.removeEventListener('mouseup', stopRotate);
	}

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
			let newX = x;
			let newY = y;

			if (direction.includes('e')) {
				newWidth = startWidth + dx; // Increase width based on mouse movement
			}
			if (direction.includes('s')) {
				newHeight = startHeight + dy; // Increase height based on mouse movement
			}
			if (direction.includes('w')) {
				const newWidthAttempt = startWidth - dx; // Shrink width based on mouse movement
				newWidth = Math.max(minSize, newWidthAttempt);
				newX = x + (startWidth - newWidth); // Adjust the x position as width decreases
			}
			if (direction.includes('n')) {
				const newHeightAttempt = startHeight - dy; // Shrink height based on mouse movement
				newHeight = Math.max(minSize, newHeightAttempt);
				newY = y + (startHeight - newHeight); // Adjust the y position as height decreases
			}

			// Update start values after repositioning the box
			startX = e.clientX;
			startY = e.clientY;
			startWidth = newWidth;
			startHeight = newHeight;

			// Update
			x = newX;
			y = newY;
			width = newWidth;
			height = newHeight;

			// Call resizeBoxBy with updated dimensions and position
			resizeBoxBy(newWidth, newHeight, direction, newX, newY);
		};

		const onUp = () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		};

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	}
</script>

<!-- Corners -->
<div class="anchor nw" onmousedown={(e) => onMouseDown(e, 'nw')} role="button" tabindex="0"></div>
<div class="anchor ne" onmousedown={(e) => onMouseDown(e, 'ne')} role="button" tabindex="0"></div>
<div class="anchor sw" onmousedown={(e) => onMouseDown(e, 'sw')} role="button" tabindex="0"></div>
<div class="anchor se" onmousedown={(e) => onMouseDown(e, 'se')} role="button" tabindex="0"></div>

<!-- Edges -->
<div class="anchor w" onmousedown={(e) => onMouseDown(e, 'w')} role="button" tabindex="0"></div>
<div class="anchor e" onmousedown={(e) => onMouseDown(e, 'e')} role="button" tabindex="0"></div>
<div class="anchor n" onmousedown={(e) => onMouseDown(e, 'n')} role="button" tabindex="0"></div>
<div class="anchor s" onmousedown={(e) => onMouseDown(e, 's')} role="button" tabindex="0"></div>

<!-- Rotation -->
<div class="rotate-handle" onmousedown={startRotate} role="button" tabindex="0"></div>

<style>
	.rotate-handle {
		width: 12px;
		height: 12px;
		background: blue;
		border-radius: 50%;
		position: absolute;
		top: -30px; /* Distance above box */
		left: 50%;
		transform: translateX(-50%);
		cursor: grab;
		z-index: 20;
	}

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
	.anchor.e {
		cursor: nwse-resize;
		bottom: calc(50% - 5px);
		right: -5px;
	}
	.anchor.w {
		cursor: nwse-resize;
		bottom: calc(50% - 5px);
		left: -5px;
	}
	.anchor.n {
		cursor: nwse-resize;
		top: -5px;
		right: calc(50% - 5px);
	}
	.anchor.s {
		cursor: nwse-resize;
		bottom: -5px;
		right: calc(50% - 5px);
	}
	.anchor.n {
		cursor: ns-resize;
	}
	.anchor.s {
		cursor: ns-resize;
	}
	.anchor.e {
		cursor: ew-resize;
	}
	.anchor.w {
		cursor: ew-resize;
	}
</style>
