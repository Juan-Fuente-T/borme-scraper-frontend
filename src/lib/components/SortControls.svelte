<script lang="ts">
    export let sortField: string;
    export let sortDirection: string;
    export let onSort: (field: string) => void;
    export let fields: { value: string; label: string }[];
</script>

<div class="flex items-center space-x-4">
    <span class="font-semibold text-gray-400">Ordenar por:</span>
    {#each fields as field}
        <button
            on:click={() => onSort(field.value)}
            class="rounded-md bg-gray-700 px-3 py-1 text-sm text-white transition hover:bg-gray-600 cursor-pointer"
            class:!bg-blue-600={sortField === field.value}
        >
            {field.label} {sortField === field.value ? (sortDirection === 'desc' ? '↓' : '↑') : ''}
        </button>
    {/each}
</div>