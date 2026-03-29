<script lang="ts">
    import { PlayerController } from "$lib/controller/character.svelte";

    const width = 200;
    const height = 200;
    const terrain: "Forest" | "Plains" | "City" | "Indoors" = "Plains";
    const strategy: string[] = [
      "Charge",
      "Hold the line",
      "Flank"
    ];

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
            <div class="row mt-3 border-end border-primary">
               	<div class="col-4 offset-8">
       	            {#each army as a}
                       	<div class="row align-items-center justify-content-end text-end">
                            <div class="col-auto">
                          		<img
                              		src={a.icon}
                              		alt={`Unit portrait of ${a.name}`}
                              		loading="lazy"
                              		fetchpriority="high"
                              		style="width: 48px;
                                                height: 48px;"
                               	/>
                            </div>
                           	<div class="col-5">
                               	<span class="unit-name">{a.name}</span>
                           	</div>
                           	<div class="col-2">
                               	<span class="unit-amount">{a.amount}</span>
                           	</div>
                        </div>
                    {/each}
                    <div class="row">
                       	<div class="col">
                           	<span class="unit-total fw-bold">{army.reduce((a, b) => a + b.amount, 0)}</span>
                       	</div>
                    </div>
               	</div>
            </div>
         </div>
         <div class="col-6">
             <span><b>Enemy</b>'s army</span>
             <div class="row mt-3 border-start border-danger">
               	<div class="col-4">
       	            {#each army2 as a}
                       	<div class="row align-items-center">
                           	<div class="col-2">
                               	<span class="unit-amount">{a.amount}</span>
                           	</div>
                           	<div class="col-5">
                                <span class="unit-name">{a.name}</span>
                           	</div>
                            <div class="col-auto">
                          		<img
                              		src={a.icon}
                              		alt={`Unit portrait of ${a.name}`}
                              		loading="lazy"
                              		fetchpriority="high"
                              		style="width: 48px;
                                                height: 48px;"
                               	/>
                            </div>
                        </div>
                    {/each}
                    <div class="row">
                       	<div class="col">
                           	<span class="unit-total fw-bold">{army2.reduce((a, b) => a + b.amount, 0)}</span>
                       	</div>
                    </div>
               	</div>
             </div>
         </div>
   	</div>
    <div class="row justify-content-center my-3">
	<div class="col-auto">
	    <h5>Strategy</h5>
		{#each strategy as strat, i}
			<div class="form-check">
                <input class="form-check-input" type="radio" name="radioDefault" id={`radioDefault${i}`}>
                <label class="form-check-label" for={`radioDefault${i}`}>
                    {strat}
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
        <button type="button" class="btn btn-lg btn-primary">Engage</button>
    </div>
</div>

<style>
    .unit-name, .unit-amount, .unit-total {
        font-size: 1.2rem;
    }

    .border-start, .border-end {
        border-width: 3px !important;
    }
  .battle-wrapper {
    background: rgba(235, 235, 235, 0.6);
    border-radius: 10px;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
</style>
