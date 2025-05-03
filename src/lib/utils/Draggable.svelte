<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		x = $bindable(),
		y = $bindable(),
		editMode,
		locked,
		onDragStart,
		onDragEnd,
		onDrag = () => {},
		containerWrapper,
		children
	}: {
		x: number;
		y: number;
		editMode: boolean;
		locked: boolean;
		onDragStart: () => void;
		onDragEnd: (didDrag: boolean) => void;
		onDrag?: (newX: number, newY: number) => void;
		containerWrapper: string;
		children: Snippet<[]>;
	} = $props();

	let offsetX = 0;
	let offsetY = 0;
	let dragging = false;
	let didDrag = false;

	function handleMouseDown(event: MouseEvent) {
		if (!editMode || locked) return;

		dragging = true;
		didDrag = false;

		offsetX = event.offsetX;
		offsetY = event.offsetY;

		onDragStart();

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	}

	function handleMouseMove(event: MouseEvent) {
		if (!dragging) return;
		didDrag = true;

		const container = (
			(event.currentTarget as HTMLElement)?.ownerDocument ?? document
		).querySelector(containerWrapper) as HTMLElement;
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

		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
	}
</script>

<div
	style="position: absolute; left: {x}px; top: {y}px;"
	onmousedown={handleMouseDown}
	role="button"
	tabindex="0"
>
	{@render children()}
</div>
