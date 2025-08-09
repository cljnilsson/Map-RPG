<script lang="ts">
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import HoverOutline from "$lib/utils/outline.svelte";

	type Mission = { title: string; description: string };

	let missions: Mission[] = $state([
		{
			title: "Lost ones",
			description:
				"A group of local children have gone missing, any clues of their whereabouts will be rewarded. Last seen two days ago. Contact Captain Brenoff for further information or to enroll in the formal search efforts."
		},
		{
			title: "Lost ones",
			description:
				"A group of local children have gone missing, any clues of their whereabouts will be rewarded. Last seen two days ago. Contact Captain Brenoff for further information or to enroll in the formal search efforts."
		}
	]);

	function clickedOnMission(task: Mission) {
		console.log(task);
	}
</script>

<div class="row border justify-content-center board">
	<div class="col mx-3 my-3">
		{#each missions as task}
			<div
				class="position-relative"
				role="button"
				tabindex="0"
				onclick={() => clickedOnMission(task)}
				onkeydown={(e) => e.key === "Enter" && clickedOnMission(task)}
			>
				<HoverOutline
					src="/modular-board/Poster3-rot.png"
					alt="Background parchment spiked upon a noticeboard."
					width="100%"
					extraClasses="position-relative"
				/>
				<div class="px-5 py-5 position-absolute top-0 w-100 mission-text" style="z-index: 1;">
					<h5>{task.title}</h5>
					<p class="m-0">{task.description}</p>
				</div>
			</div>
		{:else}
			<div class="px-5 py-5">
				<img src="/modular-board/Ruined Poster 5.png" alt="An empty ruined parchment." />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.board {
		background-image: url("/modular-board/Notice Board-blank2.jpg");
		background-repeat: none;
		background-size: contain;
		height: 420px;
		overflow-y: scroll;
	}

	.mission-text {
		pointer-events: none;
	}
</style>
