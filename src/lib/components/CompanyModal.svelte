<script lang="ts">
    export let company: any;
    export let onClose: () => void;

    // --- NUEVA FUNCIÓN DE COMBATE ---
    // Esta función se asegura de que la tecla "Enter" o "Espacio"
    // disparen la misma acción que un clic del ratón.
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            onClose();
        }
    }
</script>

<div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    on:click={onClose}
    on:keydown={handleKeyDown}  role="button"               tabindex="0"                >
    <div
        class="bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full text-gray-300"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        on:click|stopPropagation
        on:keydown={handleKeyDown}
    >
        <div class="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
            <h2 class="text-2xl font-bold">{company.name}</h2>
            <button on:click={onClose} class="text-gray-400 hover:text-white text-2xl" aria-label="Cerrar">&times;</button>
        </div>

        <div class="space-y-3">
            <p><strong>BORME ID:</strong> {company.bormeId}</p>
            <p><strong>Capital:</strong> {company.capital}</p>
        </div>
    </div>
</div>