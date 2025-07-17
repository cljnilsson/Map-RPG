<script lang="ts">
	import { postRequest } from "$lib/utils/request";
	import ImageUploader from "$lib/components/ImageUploader.svelte";
	import CreatorStat from "$lib/features/creator/creatorStat.svelte";
	import CreatorClass from "$lib/features/creator/creatorClassIcon.svelte";
	import type { Character } from "$lib/server/db/schema";

	const defaultStat = 6; // change back to 5 after testing

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
	let view: "character" | "class" | "faith" = $state("character");

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
			<h3 class="text-center">Create your character!</h3>
		</div>
		<div class="c-body">
			<div class="row justify-content-center my-5">
				<div class="col-12 position-relative">
					<!-- Side Menu (absolute) -->
					<div class="char-menu">
						<div>
							<button class="btn" onclick={() => (view = "character")}><h5>Character</h5></button>
						</div>
						<div>
							<button class="btn" onclick={() => (view = "class")}><h5>Class</h5></button>
						</div>
						<div>
							<button class="btn" onclick={() => (view = "faith")}><h5>Faith</h5></button>
						</div>
					</div>

					<!-- Main stats/content -->
					<div class="main-content offset">
						{#if view === "character"}
							<div class="row">
								<div class="col">
									<div class="c-avatar">
										<ImageUploader />
									</div>
								</div>
							</div>
							<div class="row">
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
										<CreatorClass path={"/classes/barbarian.png"}/>
										<CreatorClass path={"/classes/fighter.png"}/>
										<CreatorClass path={"/classes/rogue.png"}/>
									</div>
									<div class="row justify-content-center">
										<CreatorClass path={"/classes/druid.png"}/>
										<CreatorClass path={"/classes/bard.png"}/>
										<CreatorClass path={"/classes/ranger.png"}/>
									</div>
									<div class="row justify-content-center">
										<CreatorClass path={"/classes/monk.png"}/>
										<CreatorClass path={"/classes/paladin.png"}/>
										<CreatorClass path={"/classes/cleric.png"}/>
									</div>
									<div class="row justify-content-center">
										<CreatorClass path={"/classes/warlock.png"}/>
										<CreatorClass path={"/classes/wizard.png"}/>
										<CreatorClass path={"/classes/sorc.png"}/>
									</div>
								</div>
							</div>
							<div class="row my-5">
								<div class="col">
									<h5>Amazing class</h5>
									<p>Lorem ipsum!</p>
								</div>
							</div>
						{:else if view === "faith"}
							<div class="row">
								<div class="col text-center">
									<h5>Faith selection coming soon!</h5>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
			<div class="c-footer">
				<div class="row justify-content-center my-5">
					<div class="col-xl-4 col-md-10">
						<input class="form-control" placeholder="Name" type="text" bind:value={name} />
					</div>
					<div class="col-xl-2 col-md-10">
						<input class="form-control" placeholder="Age" type="number" bind:value={age} />
					</div>
				</div>
			</div>
		</div>
		<div class="text-center">
			<button class="btn btn-lg btn-primary" onclick={createCharater} disabled={totalLeft > 0 || age <= 5 || name.length === 0}
				>Create!</button
			>
		</div>
	</div>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
	.char-menu {
		position: absolute;
		text-align: left;
	}
</style>
