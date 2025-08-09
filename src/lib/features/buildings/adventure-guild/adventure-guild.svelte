<script lang="ts">
	import { scale, fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import HoverOutline from "$lib/utils/outline.svelte";

	type Mission = { title: string; description: string };

	// TODO add emblem at random bottom location

	let missions: Mission[] = [
		{
			title: "Lost ones",
			description:
				"A group of local children have gone missing, any clues of their whereabouts will be rewarded. Last seen two days ago. Contact Captain Brenoff for further information or to enroll in the formal search efforts."
		},
		{
			title: "Lost ones2",
			description:
				"A group of local children have gone missing, any clues of their whereabouts will be rewarded. Last seen two days ago. Contact Captain Brenoff for further information or to enroll in the formal search efforts."
		},
		{
			title: "Lost ones3",
			description:
				"A group of local children have gone missing, any clues of their whereabouts will be rewarded. Last seen two days ago. Contact Captain Brenoff for further information or to enroll in the formal search efforts."
		}
	];

	let selectedMission: Mission | null = null;

	function clickedOnMission(task: Mission) {
		selectedMission = task;
		missions = missions.filter((v) => v.title !== task.title);
	}

	function closeMission() {
		if (selectedMission) {
			missions = [...missions, selectedMission];
			selectedMission = null;
		}
	}

	function closeMissionEnter(e: KeyboardEvent) {
		if (e.key === "Enter" || e.key === " ") {
			closeMission();
		}
	}
</script>

<!-- Scrollable board -->
<div class="row justify-content-center board">
	<div class="col mx-3 my-3">
		{#each missions as task (task.title)}
			<div
				class="position-relative"
				role="button"
				tabindex="0"
				onclick={() => clickedOnMission(task)}
				onkeydown={(e) => e.key === "Enter" && clickedOnMission(task)}
				animate:flip
			>
				<HoverOutline src="/modular-board/Poster3-rot.png" alt="Background parchment spiked upon a noticeboard." width="100%" />
				<div class="px-5 py-5 position-absolute top-0 w-100 mission-text" style="z-index: 1;">
					<h5>{task.title}</h5>
					<p class="m-0">{task.description}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Overlay for selected mission -->
{#if selectedMission}
	<div class="overlay" onclick={() => closeMission()} role="button" tabindex={0} onkeydown={closeMissionEnter}>
		<div class="row justify-content-center">
			<div class="col-xl-5 col-md-8">
				<div
					class="mission-popup"
					onclick={(e) => e.stopPropagation()}
					in:scale={{ duration: 300 }}
					out:fade={{ duration: 200 }}
					role="button"
					tabindex={0}
					onkeydown={(e) => e.stopPropagation()}
				>
					<div class="poster-bg">
						<h5>{selectedMission.title}</h5>
						<p>{selectedMission.description}</p>
					</div>
					<div class="text-end">
						<button class="btn btn-primary decline me-2">Decline</button>
						<button class="btn btn-primary accept me-5">Accept</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.poster-bg {
		background-image: url("/modular-board/Poster3-rot.png");
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: #000;
		padding: 3em;
	}

	.board {
		background: #e3c9b2;
		//border-color: #64483a;
		//border-radius: 5px;
		min-height: 400px;
		border: solid calc(0.8vw + 4px) #f9e2c3;
		border-image: url("/parchment-border.avif");
		border-image-slice: 32 fill;
		border-image-repeat: stretch;
		background-clip: padding-box;
	}

	.mission-text {
		pointer-events: none;
	}

	.decline {
		margin-top: -5rem;
		background-color: #e3c9b2;
		border-color: #794f36;
		color: #685247;
		&:hover {
			background-color: #dfb48e;
			border-color: #794f36;
			color: #64483a;
		}
	}

	.accept {
		margin-top: -5rem;
		background-color: #e3c9b2;
		border-color: #794f36;
		color: #685247;
		&:hover {
			background-color: #dfb48e;
			border-color: #794f36;
			color: #64483a;
		}
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
</style>
