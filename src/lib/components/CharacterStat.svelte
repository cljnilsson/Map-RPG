<script lang="ts">
    let {name, value}: {name: string, value: number} = $props();
</script>
<div class="row">
    <div class="col-xl-8 col-sm-10">
        <p>{name}</p>
    </div>
    <div class="col-auto">
        <p>{value}</p>
    </div>
</div>