<script lang="ts">
    import { onMount } from 'svelte';
    import { companies, isLoading, errorMessage } from '$lib/stores';
    import { getAllCompanies } from '$lib/api';
    import "../../app.css";


    // onMount se ejecuta UNA SOLA VEZ, justo cuando la página se carga por primera vez.
    onMount(async () => {
        // Da la orden de "cargando". Actualiza el store.
        isLoading.set(true);
        errorMessage.set(null); // Limpia errores anteriores.

        try {
            // Llama a la API.
            const response = await getAllCompanies();

            // 3. Verifica la respuesta del backend.
            if (response.data.success) {
                // Si todo va bien, guarda la lista de compañías en el store.
                companies.set(response.data.companies);
            } else {
                // Se guardan posibles problemas.
                errorMessage.set("El servidor reportó un error al cargar las compañías.");
            }
        } catch (err) {
            errorMessage.set("Fallo de conexión. No se pudo contactar con el servidor.");
            console.error(err);
        } finally {
            // En cualquier caso, la carga ha terminado. Actualiza el store.
            isLoading.set(false);
        }
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
        <div class="overflow-x-auto">
            <table class="min-w-full bg-gray-800 border border-gray-700">
                <thead class="bg-gray-700">
                    <tr>
                        <th class="py-3 px-4 text-left">BORME ID</th>
                        <th class="py-3 px-4 text-left">Nombre</th>
                        <th class="py-3 px-4 text-left">Capital</th>
                        <th class="py-3 px-4 text-left">Tipo de Acto</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $companies as company}
                        <tr class="hover:bg-gray-700 border-t border-gray-600">
                            <td class="py-2 px-4">{company.bormeId}</td>
                            <td class="py-2 px-4 font-semibold">{company.name}</td>
                            <td class="py-2 px-4">{company.capital}</td>
                            <td class="py-2 px-4">{company.actType}</td>
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