<script lang="ts">
	import CityStore from '$lib/stores/city.svelte';
    import Window from "$lib/features/window/window.svelte";
    import UnitDesignator from '$lib/components/windows/unit/unitDesignator.svelte';
    import { onDestroy } from 'svelte';

    let queue: {from: string, to: string, timeLeftSeconds: number}[] = [{from: "Soldier", to: "Priest", timeLeftSeconds: 15}];

    const timer = setInterval(() => {
        queue = queue.map(q => {
            q.timeLeftSeconds -= 1;
            return q;
        }).filter(q => q.timeLeftSeconds > 0);
    }, 1000);

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window height={600} width={400}>
    {#snippet title()}
        <h4 class="my-2">Management</h4>
    {/snippet}
    {#snippet body()}
        <h5>Your city - population {CityStore.population}</h5>

        <UnitDesignator name="Soldiers" bind:unit={CityStore.soldiers} bind:available={CityStore.workers} />
        <UnitDesignator name="Merchants" bind:unit={CityStore.merchants} bind:available={CityStore.workers} />
        <UnitDesignator name="Smiths" bind:unit={CityStore.smiths} bind:available={CityStore.workers} />
        <UnitDesignator name="Priests" bind:unit={CityStore.priests} bind:available={CityStore.workers} />

        <h5>Workers {CityStore.workers}</h5>
    {/snippet}
    {#snippet footer()}
        {#each queue as q}
            {q.from} is reeducating to {q.to} in {q.timeLeftSeconds}
        {/each}
    {/snippet}
</Window>