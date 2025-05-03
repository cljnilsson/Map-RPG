<script lang="ts">
	import type {Snippet} from "svelte";
	let {
		x = $bindable(),
		y = $bindable(),
		locked = false,
		onDragStart = () => {},
		onDragEnd = () => {},
		onDrag = () => {},
		containerWrapper,
		children
	}: {x: number, y: number, locked?: boolean, onDragStart?: () => void, onDragEnd?: (didDrag: boolean) => void, onDrag?: (x: number, y: number) => void, containerWrapper: string, children: Snippet<[]>} = $props();

	let offsetX = $state(0);
	let offsetY = $state(0);
	let dragging = $state(false);
	let didDrag = $state(false);

	function handleMouseDown(event: MouseEvent) {
		if (locked) return;
		
		const containerElement = document.querySelector(containerWrapper);
		if (!containerElement) return;

		const rect = containerElement.getBoundingClientRect();
		offsetX = event.clientX - rect.left - x;
		offsetY = event.clientY - rect.top - y;

		dragging = true;
		didDrag = false;
		onDragStart();

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		console.log("START");
	}

	function handleMouseMove(event: MouseEvent) {
		if (!dragging) return;

		didDrag = true;
		const containerElement = document.querySelector(containerWrapper);
		if (!containerElement) return;

		const rect = containerElement.getBoundingClientRect();
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

		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
	}
</script>

<!-- The handle itself -->
<div onmousedown={handleMouseDown} style="cursor: grab;" role="button" tabindex="0">
	{@render children()}
</div>
