<script lang="ts">
    let name: string;
    let age: number;
    let str: number, int: number, vitality: number, charisma: number, dex: number;
    const min: number = 3, max: number = 20;
</script>

<div class="wrapper mt-5 mx-5 px-3">
    <h3 class="text-center">Create your character!</h3>
    <div class="row justify-content-center my-5">
        <div class="col-6">
            <div class="row">
                <div class="col">
                    <input class="form-control my-1" type="text" placeholder="Name" bind:value={name} />
                </div>
                <div class="col-4">
                    <input class="form-control my-1" type="text" placeholder="Age" bind:value={age} />
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <input class="form-control my-1" type="number" placeholder="Strength" bind:value={str} min={min} max={max} />
                    <input class="form-control my-1" type="number" placeholder="Dex" bind:value={dex} min={min} max={max} />
                    <input class="form-control my-1" type="number" placeholder="Int" bind:value={int} min={min} max={max} />
                </div>
                <div class="col">
                    <input class="form-control my-1" type="number" placeholder="Charisma" bind:value={charisma} min={min} max={max} />
                    <input class="form-control my-1" type="number" placeholder="Vitality" bind:value={vitality} min={min} max={max} />
                </div>
            </div>
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
