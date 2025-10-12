<script lang="ts">
    export let currentPage: number;
    export let totalPages: number;
    export let totalElements: number;
    export let onNext: () => void;
    export let onPrev: () => void;
    export let isLoading: boolean = false;
</script>

<div class="flex justify-between items-center mb-4 bg-gray-800 p-3 rounded-md">
    <p class="text-gray-400 text-sm">
        Mostrando página {currentPage + 1} de {totalPages} ({totalElements} registros en total)
    </p>
    <div class="space-x-2">
        <button
            on:click={onPrev}
            disabled={currentPage === 0 || isLoading}
            class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
            &larr; Anterior
        </button>
        <button
            on:click={onNext}
            disabled={currentPage >= totalPages - 1 || isLoading}
            class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
            Siguiente &rarr;
        </button>
    </div>
</div>