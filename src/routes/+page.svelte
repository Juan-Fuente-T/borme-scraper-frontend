<script lang="ts">
	import { isLoading, errorMessage } from '$lib/stores';
	import { processBormeForDate, getCompaniesByDate } from '$lib/api';
	import { writable } from 'svelte/store';

	let selectedDate: string = new Date().toISOString().split('T')[0];
	const processingResult = writable<any>(null);
	// --- NUEVO ESTADO PARA DATOS DE COMPAÑIAS DEL DÍA ---
	const companiesOfTheDay = writable<any[]>([]);
	let selectedCompanyForModal: any = null; // Controla si el modal está visible y qué compañía muestra

	async function handleProcess() {
		isLoading.set(true);
		errorMessage.set(null);
		processingResult.set(null);
		companiesOfTheDay.set([]); // Limpia la lista de compañías anterior

		try {
			const processResponse = await processBormeForDate(selectedDate);
			processingResult.set(processResponse.data);

			// Si el procesamiento tuvo éxito y encontró compañías,
			// inmediatamente hacemos una segunda llamada para recuperarlas.
			if (processResponse.data.success && processResponse.data.companiesFound > 0) {
				const companiesResponse = await getCompaniesByDate(0, 20, selectedDate);
				if (companiesResponse.data.success) {
					companiesOfTheDay.set(companiesResponse.data.companies);
				} else {
					errorMessage.set('Procesado con éxito, pero falló la recuperación de compañías.');
				}
			}
		} catch (err: any) {
			processingResult.set({
				success: false,
				message: 'Fallo de conexión: ' + (err.message || 'No se pudo contactar con el servidor.')
			});
		} finally {
			isLoading.set(false);
		}
	}
</script>

<div class="container mx-auto">
	<h1 class="mb-6 border-b border-gray-700 pb-2 text-4xl font-bold">Dashboard de Procesamiento</h1>

	<form class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg" on:submit|preventDefault={handleProcess}>
		<div class="flex items-end space-x-4">
			<div class="flex-grow">
				<label for="date-input" class="mb-1 block text-sm font-medium text-gray-400">
					Seleccionar Fecha a Procesar
				</label>
				<input
					type="date"
					id="date-input"
					bind:value={selectedDate}
					class="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<button
				type="submit"
				class="rounded-md bg-blue-600 px-6 py-2 font-bold text-white transition duration-300 hover:bg-blue-700 disabled:opacity-50"
				disabled={$isLoading}
			>
				{#if $isLoading}
					Procesando...
				{:else}
					Procesar
				{/if}
			</button>
		</div>
	</form>

	{#if $processingResult}
		{@const result = $processingResult}
		<div
			class="rounded-lg p-6 shadow-lg"
			class:bg-gray-800={result.success}
			class:border-green-700={result.success}
			class:bg-red-900={!result.success}
			class:border-red-700={!result.success}
		>
			<h2 class="mb-2 text-2xl font-bold">Informe de Procesamiento</h2>
			<p class="text-lg">
				<strong class:text-green-300={result.success} class:text-red-300={!result.success}>
					{result.success ? 'ÉXITO' : 'FALLO'}
				</strong>
				- {result.message}
			</p>
			{#if result.success}
				<ul class="mt-4 list-inside list-disc space-y-1 text-gray-300">
					<li>Fecha procesada: {result.date}</li>
					<li>Ficheros procesados: {result.filesProcessed}</li>
					<li>Compañías encontradas: {result.companiesFound}</li>
				</ul>
			{/if}

			{#if $companiesOfTheDay.length > 0}
				<div class="mt-8">
					<h2 class="mb-4 text-3xl font-bold">
						Compañías Encontradas ({$processingResult?.companiesFound || 0})
					</h2>
					<div class="overflow-x-auto">
						<table class="min-w-full border border-gray-700 bg-gray-800">
							<thead class="bg-gray-700">
								<tr>
									<th class="px-4 py-3 text-left">Nombre</th>
									<th class="px-4 py-3 text-left">Objeto social</th>
									<th class="px-4 py-3 text-left">Fecha de constitución</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{#each $companiesOfTheDay as company}
									<tr class="border-t border-gray-600 hover:bg-gray-700">
										<td class="px-4 py-2 font-semibold">{company.name}</td>
										<td class="px-4 py-2">{company.object}</td>
										<td class="px-4 py-2">{company.startDate}</td>
										<td class="px-4 py-2">
											<button
												on:click={() => (selectedCompanyForModal = company)}
												class="rounded-md bg-blue-600 px-3 py-1 text-sm font-bold text-white hover:bg-blue-700"
											>
												Ver Detalles
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
			{#if result.fileUrls && result.fileUrls.length > 0}
				<div class="mt-6">
					<h3 class="mb-3 text-xl font-semibold">Enlaces a ficheros procesados:</h3>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each result.fileUrls as url}
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								class="block truncate rounded-md bg-gray-700 p-3 text-stone-200 transition duration-200 hover:bg-gray-600 hover:text-white"
								title={url.substring(url.lastIndexOf('/') + 1)}
							>
								{url.substring(url.lastIndexOf('/') + 1)}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
