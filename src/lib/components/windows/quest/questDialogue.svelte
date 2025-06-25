<script lang="ts">
    import type { Quest } from "$lib/types/quest";
    import {isMessageText, isMessageChoice} from "$lib/typeguards/message";   

    let {active} : {active: Quest} = $props();
</script>

{#each active.dialogue as d}
	<div class="questDialogue">
		{#if isMessageText(d)}
			<p><b>{d.from.name}</b>: {d.text}</p>
		{:else if isMessageChoice(d)}
			<p><b>You</b>: {d.choices[0]?.text ?? "ERROR: NO CHOICES IN CHOICEMESSAGE"}</p>
		{:else}
			ERROR: Unknown dialogue type
		{/if}
	</div>
{/each}
