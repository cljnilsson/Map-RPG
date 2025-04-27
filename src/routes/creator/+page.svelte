<script lang="ts">
	import ImageUploader from "$lib/components/ImageUploader.svelte";
	import CreatorStat from "$lib/features/creator/creatorStat.svelte";

    let name: string = $state("");
    let age: number = $state(18);
    let str: number = $state(5), int: number = $state(5), vitality: number = $state(5), charisma: number = $state(5), dex: number = $state(5);
    let total = $derived(str + int + vitality + charisma + dex);
    const min: number = 3, max: number = 20, totalMax: number = 30;
    let totalLeft = $derived(totalMax - total);
</script>

<div class="wrapper mt-5 mx-5 px-3">
    <h3 class="text-center">Create your character!</h3>
    <div class="row justify-content-center my-5">
        <div class="col-6">
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
            <CreatorStat name="Str" min={min} max={max} total={total} totalMax={totalMax} bind:stat={str} />
            <CreatorStat name="Dex" min={min} max={max} total={total} totalMax={totalMax} bind:stat={dex} />
            <CreatorStat name="Int" min={min} max={max} total={total} totalMax={totalMax} bind:stat={int} />
            <CreatorStat name="Vit" min={min} max={max} total={total} totalMax={totalMax} bind:stat={vitality} />
            <CreatorStat name="Charisma" min={min} max={max} total={total} totalMax={totalMax} bind:stat={charisma} />
        </div>
    </div>
    <div class="row justify-content-center my-5">
        <div class="col-xl-2 col-md-4">
            <input class="form-control" placeholder="Name" type="text" bind:value={name}>
        </div>
        <div class="col-xl-1 col-md-2">
            <input class="form-control" placeholder="Age" type="number" bind:value={age}>
        </div>
    </div>
    <div class="text-center">
        <button class="btn btn-lg btn-primary">Create!</button>
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
