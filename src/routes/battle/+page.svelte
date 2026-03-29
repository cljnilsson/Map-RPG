<script lang="ts">
    import { PlayerController } from "$lib/controller/character.svelte";
    import Army from "$lib/features/battle/army.svelte";

    const width = 200;
    const height = 200;
    const terrain: "Forest" | "Plains" | "City" | "Indoors" = "Plains";
    const strategyOptions: string[] = [
      "Charge",
      "Hold the line",
      "Flank"
    ];

    let strat: string | undefined = $state(undefined);

    const army = [
      {name: "Soldier", amount: 2, icon: "/units/soldier.jpg"},
      {name: "Captain", amount: 1, icon: "/units/captain.jpg"},
      {name: "Ranger", amount: 2, icon: "/units/ranger.png"},
      {name: "Dog", amount: 2, icon: "/units/wolf.png"},
    ];

    const army2 = [
      {name: "Marauder", amount: 4, icon: "/units/orc1.jpg"},
      {name: "Witch", amount: 1, icon: "/units/orc-witch.jpg"},
      {name: "Assassin", amount: 2, icon: "/units/orc-assassin.jpg"},
      {name: "Warchief", amount: 1, icon: "/units/orc2.jpg"},
    ];
</script>

<div class="battle-wrapper my-3 mx-5">
    <h2 class="text-center">Battle</h2>
    <div class="row">
    	<div class="col text-end">
       		<img
          		src={PlayerController.imagePath}
          		alt="Your character"
          		loading="lazy"
          		fetchpriority="high"
          		style="width: {width}px;
                            height: {height}px;"
           	/>
    	</div>
    	<div class="col">
       		<img
          		src={"/orc.png"}
          		alt="Enemy"
          		loading="lazy"
          		fetchpriority="high"
          		style="width: {width}px;
                            height: {height}px;"
           	/>
    	</div>
    </div>
    <div class="row">
    	<div class="col text-center py-3">
        	<h5>Terrain: {terrain} </h5>
    	</div>
    </div>
    <div class="row">
    	<div class="col-6 text-end">
            <span><b>{PlayerController.name}</b>'s army</span>
            <Army side="left" army={army} />
        </div>
         <div class="col-6">
             <span><b>Enemy</b>'s army</span>
             <Army side="right" army={army2} />
         </div>
   	</div>
    <div class="row justify-content-center my-3">
	<div class="col-auto">
	    <h5>Strategy</h5>
		{#each strategyOptions as s, i}
			<div class="form-check">
                <input class="form-check-input" type="radio" name="radioDefault" id={`radioDefault${i}`}
                    bind:group={strat}
                    value={s}>
                <label class="form-check-label" for={`radioDefault${i}`}>
                    {s}
                </label>
            </div>
		{/each}
	</div>
    </div>
    <div class="row justify-content-center my-3">
	<div class="col-auto">
	    All modifiers here
	</div>
    </div>
    <div class="text-center mt-3">
        <button type="button" class="btn btn-lg btn-primary" disabled={!strat}>Engage</button>
    </div>
</div>

<style>
  .battle-wrapper {
    background: rgba(235, 235, 235, 0.6);
    border-radius: 10px;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
</style>
