<script lang="ts">
    import { onMount } from 'svelte';
    import { companies, isLoading, errorMessage } from '$lib/stores';
    import { getAllCompanies } from '$lib/api';
    import "../../app.css";

    // --- ESTADO DE PAGINACIÓN ---
    let currentPage = 0;
    let totalPages = 0;
    let totalElements = 0;
    const pageSize = 20; // Consistente con el back

    async function fetchCompanies(page: number) {
        isLoading.set(true);
        errorMessage.set(null);
        try {
            const response = await getAllCompanies(page, pageSize);
            if (response.data.success) {
                companies.set(response.data.companies);
                // Actualiza con la información del back
                totalPages = response.data.totalPages;
                totalElements = response.data.total;
                currentPage = response.data.currentPage;
            } else {
                errorMessage.set("El servidor reportó un error al cargar las compañías.");
            }
        } catch (err) {
            errorMessage.set("Fallo de conexión. No se pudo contactar con el servidor.");
            console.error(err);
        } finally {
            isLoading.set(false);
        }
    }

    // --- MANEJADORES DE NAVEGACIÓN ---
    function goToNextPage() {
        if (currentPage < totalPages - 1) {
            fetchCompanies(currentPage + 1);
        }
    }

    function goToPrevPage() {
        if (currentPage > 0) {
            fetchCompanies(currentPage - 1);
        }
    }

    // Carga de la primera página al iniciar el componente.
    onMount(() => {
        fetchCompanies(0);
    });
</script>

<div class="container mx-auto p-8 bg-gray-900 text-gray-200 min-h-screen">
    <h1 class="text-4xl font-bold mb-6 border-b border-gray-700 pb-2">
        Directorio de Compañías
    </h1>

    {#if $isLoading}
        <div class="text-center p-10">
            <p class="text-xl text-blue-400">Cargando datos del servidor...</p>
        </div>
    {:else if $errorMessage}
        <div class="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-md">
            <strong class="font-bold">¡No se han podido cargar las compañías!</strong>
            <span class="block sm:inline">{$errorMessage}</span>
        </div>
    {:else if $companies.length > 0}
        <div class="flex justify-between items-center mb-4 bg-gray-800 p-3 rounded-md">
            <p class="text-gray-400 text-sm">
                Mostrando página {currentPage + 1} de {totalPages} ({totalElements} registros en total)
            </p>
            <div class="space-x-2">
                <button
                    on:click={goToPrevPage}
                    disabled={currentPage === 0}
                    class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    &larr; Anterior
                </button>
                <button
                    on:click={goToNextPage}
                    disabled={currentPage >= totalPages - 1}
                    class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente &rarr;
                </button>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-gray-800 border border-gray-700">
                <thead class="bg-gray-700">
                    <tr>
                        <th class="py-3 px-4 text-left">BORME ID</th>
                        <th class="py-3 px-4 text-left">Nombre</th>
                        <th class="py-3 px-4 text-left">Objeto Social</th>
                        <th class="py-3 px-4 text-left">Fecha de constitución</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $companies as company}
                        <tr class="hover:bg-gray-700 border-t border-gray-600">
                            <td class="py-2 px-4">{company.bormeId}</td>
                            <td class="py-2 px-4 font-semibold">{company.name}</td>
                            <td class="py-2 px-4">{company.object}</td>
                            <td class="py-2 px-4">{company.startDate}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <div class="bg-gray-800 border border-gray-700 p-6 rounded-md">
            <p class="text-lg text-center">No se encontraron compañías en la base de datos.</p>
        </div>
    {/if}
</div>