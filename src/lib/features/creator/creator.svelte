<script lang="ts">
	import { postRequest } from "$lib/utils/request";
	import ImageUploader from "$lib/components/ImageUploader.svelte";
	import CreatorStat from "$lib/features/creator/creatorStat.svelte";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";
	import type { Character } from "$lib/server/db/schema";
	import ClassStore from "$lib/stores/classes.svelte";
	import type { Class } from "$lib/types/class";
	import type { Faith } from "$lib/types/faith";
	import { faker } from '@faker-js/faker';
   	import FaithStore from "$lib/stores/faith.svelte";
    import FaithPicker from "$lib/features/creator/faithPicker.svelte";
    import ClassPicker from "$lib/features/creator/classPicker.svelte";
    import CharMenu from "$lib/features/creator/charMenu.svelte";
    import { authClient } from "$lib/auth-client";

    const session = authClient.useSession();
    let isLoggedIn: boolean = $derived(!!$session.data?.user);

	const defaultStat = 6; // change back to 5 after testing

	let selectedClass: Class | undefined = $state(ClassStore.classes[0]);
	let selectedFaith: Faith | undefined = $state(FaithStore.faith[0]);

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

	let avatar: string = $state("");

	let total = $derived(str + int + vitality + charisma + dex);
	let totalLeft = $derived(totalMax - total);
	let view: "character" | "class" | "faith" | "image" = $state("character");

	const avatarList = [
		"/characters/male1.png",
		"/characters/male2.png",
		"/characters/male3.png",
		"/characters/girl1.png",
		"/characters/girl2.png",
		"/characters/girl3.png",
		"/characters/girl4.png",
		"/characters/girl5.png",
		"/characters/girl6.png"
	];

	async function createCharater() {
		if (!isLoggedIn) {
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

	function generateRandomFactor(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function randomize() {
	    name = faker.person.firstName();
		age = faker.number.int({min: 18, max: 80});
		avatar = avatarList[generateRandomFactor(0, avatarList.length -1)];

		// Todo proper random
		str = min;
		dex = min;
		int = min;
		vitality = min;
		charisma = min;

		while(totalLeft > 0) {
		  const rng = generateRandomFactor(0, 4);
			switch(rng) {
			  case 0:
				str += 1;
				break;
    		  case 1:
                dex += 1;
     			break;
           	  case 2:
                int += 1;
          		break;
              case 3:
                vitality += 1;
             	break;
              case 4:
                charisma += 1;
                break;
			}
		}

		selectedClass = ClassStore.classes[generateRandomFactor(0, ClassStore.classes.length -1)];
		selectedFaith = FaithStore.faith[generateRandomFactor(0, FaithStore.faith.length -1)];

		if(totalLeft === 0) {
		  console.warn("Stats were not assigned correctly.");
		}
	}
</script>

<div class="row justify-content-center px-3 mt-5 position-relative">
	<div class="col-xl-10 col-md-12 wrapper">
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
					<CharMenu bind:view />

					<!-- Main stats/content -->
					<div class="main-content offset">
						{#if view === "character"}
							<div class="row justify-content-center">
								<div class="col-auto">
									<div class="c-avatar text-center">
										<img
											src={avatar.length > 0
												? avatar
												: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"}
											alt="avatar"
											loading="lazy"
											width="200px"
											height="200px"
										/>
									</div>
								</div>
							</div>
							<div class="row mt-5">
								<div class="col text-center">
									Suggested stats: {#each selectedClass?.suggestedStats ?? [] as stat, index (stat)}
										<strong>{stat}</strong>{index < (selectedClass?.suggestedStats?.length ?? 0) - 1 ? ", " : ""}
									{/each}
								</div>
							</div>
							<div class="row mb-5">
								<div class="col text-center">
									Points left: {totalLeft}
								</div>
							</div>
							<div class="c-stats">
								<CreatorStat name="Str" {min} {max} {total} {totalMax} {totalLeft} bind:stat={str} />
								<CreatorStat name="Dex" {min} {max} {total} {totalMax} {totalLeft} bind:stat={dex} />
								<CreatorStat name="Int" {min} {max} {total} {totalMax} {totalLeft} bind:stat={int} />
								<CreatorStat name="Vit" {min} {max} {total} {totalMax} {totalLeft} bind:stat={vitality} />
								<CreatorStat name="Charisma" {min} {max} {total} {totalMax} {totalLeft} bind:stat={charisma} />
							</div>
						{:else if view === "class"}
						    <ClassPicker bind:selectedClass />
						{:else if view === "faith"}
						    <FaithPicker bind:selectedFaith />
						{:else if view === "image"}
							<div class="row mb-3">
								<div class="col">
									<div class="c-avatar">
										<ImageUploader bind:avatar />
									</div>
								</div>
							</div>
							{#each Array.from({ length: Math.ceil(avatarList.length / 3) }) as _, i (i)}
								<div class="row justify-content-center">
									{#each avatarList.slice(i * 3, i * 3 + 3) as tavatar (tavatar)}
										<div class="col-3 text-center my-2">
											<ClickableElement onClickCallback={() => (avatar = tavatar)}>
												<img src={tavatar} alt="Character avatar" width="100px" height="100px" />
											</ClickableElement>
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
			<button type="button" class="btn btn-lg btn-primary" onclick={createCharater} disabled={totalLeft > 0 || age <= 5 || name.length === 0}
				>Create!</button
			>
			<button type="button" class="btn btn-lg btn-primary" onclick={randomize}>Randomize</button>
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
</style>
