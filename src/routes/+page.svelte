<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<div class="container mt-3">
	<h1>Welcome!</h1>
	<p>More information about this project exists in the readme.md file in the base of the project folder.</p>

	<h3>Early project notes</h3>
	<p>In summery this is an attempt to merge two great interests of mine into a symbiotic game, namely Travian and DnD (Dungeons and Dragons).</p>
	<p>It is noteworthy to say that I consider this game to be two two things that should be kept in mind.</p>
	<ul>
		<li>The game is exclusively Single Player, with maybe some mild co-op elements in the far future such as a shared marketplace.</li>
		<li>I consider this game to be desktop first, meaning that while the game will run fine on a mobile device the UI will not consider it to any worthwhile degree as I think displaying the amount of required information on such a small screen is not feasible without significantly holding back the potential of the desktop experience. In the far future I may consider something similar to Oldschool Runescape where their mobile client has made very significant changes that only apply on mobile.</li>
	</ul>
	<p>It should also be said that while this game is built using standard web technologies, it is meant to be run offline / self hosted though this is very much WIP but it is being kept in mind for a final release.</p>
	<p>Your data / progress / save file will be easily available to the user so that it can be backed up by whatever means the user prefers.</p>

	<h3>Game Info</h3>
	<p>A simple first-party wiki exists at <a href={resolve("/wiki")}>link</a> but for the most part the tutorial once implemented should tell you what you need to know.</p>
	<div class="text-center">
    	<a href={resolve("/map")}>
           	<button type="button" class="btn btn-lg btn-primary">
                    Play!
            </button>
    	</a>
	</div>
</div>
