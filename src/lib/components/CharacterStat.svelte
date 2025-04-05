<script lang="ts">
    let {name, value}: {name: string, value: number} = $props();
</script>
<div class="row">
    <div class="col">
        <p>{name}</p>
    </div>
    <div class="col">
        <p>{value}</p>
    </div>
</div>