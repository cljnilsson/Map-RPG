<script lang="ts">
	import { postRequest } from "$lib/utils/request";
	import ImageUploader from "$lib/components/ImageUploader.svelte";
	import CreatorStat from "$lib/features/creator/creatorStat.svelte";
	import CreatorClass from "$lib/features/creator/creatorClassIcon.svelte";
	import type { Character } from "$lib/server/db/schema";
	import ClassStore from "$lib/stores/classes.svelte";
	import type { Class } from "$lib/types/class";

	const defaultStat = 6; // change back to 5 after testing

	let selectedClass: Class | undefined = $state(ClassStore.classes[0]);

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
	let view: "character" | "class" | "faith" | "image" = $state("character");

	const avatarList = [
		"/characters/male1.jpg",
		"/characters/male2.jpg",
		"/characters/male3.jpg",
		"/characters/girl1.jpg",
		"/characters/girl2.jpg",
		"/characters/girl3.jpg",
		"/characters/girl4.jpg",
		"/characters/girl5.jpg",
		"/characters/girl6.jpg"
	];

	function isLoggedIn() {
		return true;
	}

	async function createCharater() {
		if (!isLoggedIn()) {
			console.warn("You must be logged in to create a character.");
			return;
		}

		const resp = await postRequest<
			Character[],
			{
				name: string;
				age: number;
				stats: {
					str: number;
					dex: number;
					int: number;
					vit: number;
					charisma: number;
				};
			}
		>("api/characters", {
			name,
			age,
			stats: {
				str: str,
				dex: dex,
				int: int,
				vit: vitality,
				charisma: charisma
			}
		});

		if (resp) {
			console.log("All went well!", resp);
		} else {
			console.error("Something went wrong while creating the character.", resp);
		}
	}
</script>

<div class="row justify-content-center px-3 mt-5 position-relative">
	<div class="col-xl-4 col-md-6 wrapper">
		<div class="c-header">
			{#if name.length === 0}
				<h3 class="text-center">Create your character!</h3>
			{:else}
				<h3 class="text-center">{name}</h3>
				<h5 class="text-center">The {selectedClass?.name.toLocaleLowerCase()}</h5>
			{/if}
		</div>
		<div class="c-body">
			<div class="row justify-content-center my-5">
				<div class="col-12 position-relative">
					<!-- Side Menu (absolute) -->
					<div class="char-menu">
						<div>
							<button class="btn" class:active={view === "character"} onclick={() => (view = "character")}
								><h5>Character</h5></button
							>
						</div>
						<div>
							<button class="btn" class:active={view === "class"} onclick={() => (view = "class")}><h5>Class</h5></button>
						</div>
						<div>
							<button class="btn" class:active={view === "faith"} onclick={() => (view = "faith")}><h5>Faith</h5></button>
						</div>
						<div>
							<button class="btn" class:active={view === "image"} onclick={() => (view = "image")}><h5>Image</h5></button>
						</div>
					</div>

					<!-- Main stats/content -->
					<div class="main-content offset">
						{#if view === "character"}
							<div class="row">
								<div class="col">
									<div class="c-avatar text-center">
										<img
											src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
											alt="avatar"
											width="200px"
											height="200px"
										/>
									</div>
								</div>
							</div>
							<div class="row mt-5">
								<div class="col text-center">
									Suggested stats: {selectedClass?.suggestedStats.join(", ")}
								</div>
							</div>
							<div class="row mb-5">
								<div class="col text-center">
									Points left: {totalLeft}
								</div>
							</div>
							<div class="c-stats">
								<CreatorStat name="Str" {min} {max} {total} {totalMax} bind:stat={str} />
								<CreatorStat name="Dex" {min} {max} {total} {totalMax} bind:stat={dex} />
								<CreatorStat name="Int" {min} {max} {total} {totalMax} bind:stat={int} />
								<CreatorStat name="Vit" {min} {max} {total} {totalMax} bind:stat={vitality} />
								<CreatorStat name="Charisma" {min} {max} {total} {totalMax} bind:stat={charisma} />
							</div>
						{:else if view === "class"}
							<div class="row">
								<div class="col text-center">
									<div class="row justify-content-center">
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[0]} />
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[1]} />
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[2]} />
									</div>
									<div class="row justify-content-center">
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[3]} />
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[4]} />
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[5]} />
									</div>
									<div class="row justify-content-center">
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[6]} />
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[7]} />
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[8]} />
									</div>
									<div class="row justify-content-center">
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[9]} />
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[10]} />
										<CreatorClass bind:selectedClass gameClass={ClassStore.classes[11]} />
									</div>
								</div>
							</div>
							<div class="row my-5">
								<div class="col">
									<h5>{selectedClass?.name}</h5>
									<p>{selectedClass?.description}</p>
								</div>
							</div>
						{:else if view === "faith"}
							<div class="row">
								<div class="col text-center">
									<h5>Faith selection coming soon!</h5>
								</div>
							</div>
						{:else if view === "image"}
							<div class="row mb-3">
								<div class="col">
									<div class="c-avatar">
										<ImageUploader />
									</div>
								</div>
							</div>
							{#each Array.from({ length: Math.ceil(avatarList.length / 3) }) as _, i}
								<div class="row justify-content-center">
									{#each avatarList.slice(i * 3, i * 3 + 3) as avatar}
										<div class="col-3 text-center my-2">
											<img src={avatar} alt="Character avatar" width="100px" height="100px" />
										</div>
									{/each}
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<div class="c-footer">
				{#if view === "character"}
					<div class="row justify-content-center my-5">
						<div class="col-xl-4 col-md-10">
							<input class="form-control" placeholder="Name" type="text" bind:value={name} />
						</div>
						<div class="col-xl-2 col-md-10">
							<input class="form-control" placeholder="Age" type="number" bind:value={age} />
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="text-center">
			<button class="btn btn-lg btn-primary" onclick={createCharater} disabled={totalLeft > 0 || age <= 5 || name.length === 0}
				>Create!</button
			>
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
	.char-menu {
		position: absolute;
		text-align: left;
		.active {
			color: rgb(88, 167, 250);
		}
		.btn {
			&:hover {
				color: rgb(88, 167, 250);
			}
		}
	}
</style>
