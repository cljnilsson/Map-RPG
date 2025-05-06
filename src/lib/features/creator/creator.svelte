<script lang="ts">
	import ImageUploader from "$lib/components/ImageUploader.svelte";
	import CreatorStat from "$lib/features/creator/creatorStat.svelte";

    const defaultStat = 5;

	let name: string = $state("");
	let age: number = $state(18);
	let str: number = $state(defaultStat),
		int: number = $state(defaultStat),
		vitality: number = $state(defaultStat),
		charisma: number = $state(defaultStat),
		dex: number = $state(defaultStat);

	const min: number = 3,
		max: number = 20,
		totalMax: number = 30;

    let total = $derived(str + int + vitality + charisma + dex);
	let totalLeft = $derived(totalMax - total);
</script>

<div class="wrapper mt-5 mx-5 px-3">
	<h3 class="text-center">Create your character!</h3>
	<div class="row justify-content-center my-5">
		<div class="col-10">
			<div class="row">
				<div class="col">
					<ImageUploader />
				</div>
			</div>
			<div class="row">
				<div class="col text-center">
					Points left: {totalLeft}
				</div>
			</div>
			<CreatorStat name="Str" {min} {max} {total} {totalMax} bind:stat={str} />
			<CreatorStat name="Dex" {min} {max} {total} {totalMax} bind:stat={dex} />
			<CreatorStat name="Int" {min} {max} {total} {totalMax} bind:stat={int} />
			<CreatorStat name="Vit" {min} {max} {total} {totalMax} bind:stat={vitality} />
			<CreatorStat name="Charisma" {min} {max} {total} {totalMax} bind:stat={charisma} />
		</div>
	</div>
	<div class="row justify-content-center my-5">
		<div class="col-xl-4 col-md-8">
			<input class="form-control" placeholder="Name" type="text" bind:value={name} />
		</div>
		<div class="col-xl-2 col-md-8">
			<input class="form-control" placeholder="Age" type="number" bind:value={age} />
		</div>
	</div>
	<div class="text-center">
		<button
			class="btn btn-lg btn-primary"
			disabled={totalLeft === 0 || age <= 5 || name.length === 0}>Create!</button
		>
	</div>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
