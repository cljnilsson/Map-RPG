<script lang="ts">
	let {
		x = $bindable(),
		y = $bindable(),
		onDragStart = () => {},
		onDragEnd = () => {},
		onDrag = () => {},
		containerWrapper,
		children
	} = $props();

	let offsetX = $state(0);
	let offsetY = $state(0);
	let dragging = $state(false);
	let didDrag = $state(false);

	function handleMouseDown(event: MouseEvent) {
		const container = document.querySelector(containerWrapper) as HTMLElement;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		offsetX = event.clientX - rect.left - x;
		offsetY = event.clientY - rect.top - y;

		dragging = true;
		didDrag = false;
		onDragStart();

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		console.log("START")
	}

	function handleMouseMove(event: MouseEvent) {
		if (!dragging) return;

		didDrag = true;
		const container = document.querySelector(containerWrapper) as HTMLElement;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		x = event.clientX - rect.left - offsetX;
		y = event.clientY - rect.top - offsetY;

		onDrag(x, y);
	}

	function handleMouseUp() {
		if (dragging) {
			onDragEnd(didDrag);
		}
		dragging = false;
		didDrag = false;

		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	}
</script>

<!-- The handle itself -->
<div onmousedown={handleMouseDown} style="cursor: grab;">
	{@render children()}
</div>
