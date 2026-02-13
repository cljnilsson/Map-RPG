<script lang="ts">
import ClickableElement from "$lib/components/utils/clickableElement.svelte";
import type { CraftItem } from "$lib/types/item";

let {
	inspectItem = $bindable(),
	recipes,
}: {
	inspectItem: CraftItem | undefined;
	recipes: Array<CraftItem | undefined>;
} = $props();
</script>

<div class="recipeList">
   	{#each recipes as r, i (i)}
  		{#if r}
 			<div class="row recipe-entry px-2 my-1" class:selected={r.id === inspectItem?.id}>
				<div class="col">
   					<ClickableElement onClickCallback={() => (inspectItem = r)}>
  						<div>
 							<img src={r.iconPath} width={16} height={16} class="me-1" alt={r.description} /><span>{r.name}</span>
  						</div>
   					</ClickableElement>
				</div>
 			</div>
  		{/if}
   	{/each}
</div>

<style>
    .recipeList {
		/* Should add scroll hopefully */
		max-height: 15rem;
		overflow-x: hidden;
		overflow-y: auto;
	}

   	.recipe-entry {
		transition: all 0.15s ease-in-out;
	}

	.recipe-entry:hover {
		background: linear-gradient(
			to right,
			rgba(255, 140, 0, 0) 0%,
			rgba(30, 30, 30, 0.5) 15%,
			rgba(30, 30, 30, 0.35) 65%,
			rgba(255, 140, 0, 0) 90%
		);
	}

	.selected {
		background: linear-gradient(
			to right,
			rgba(255, 140, 0, 0) 0%,
			rgba(255, 160, 0, 0.5) 15%,
			rgba(255, 120, 0, 0.35) 65%,
			rgba(255, 140, 0, 0) 90%
		);
	}
</style>
