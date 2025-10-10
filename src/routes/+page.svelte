<script lang="ts">
	import { isLoading, errorMessage } from '$lib/stores';
	import { processBormeForDate } from '$lib/api';
	import { writable } from 'svelte/store';

	let selectedDate: string = new Date().toISOString().split('T')[0];
	const processingResult = writable<any>(null);

	async function handleProcess() {
		isLoading.set(true);
		errorMessage.set(null);
		processingResult.set(null);

		try {
			const response = await processBormeForDate(selectedDate);
			processingResult.set(response.data);
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
			class:bg-green-900={result.success}
			class:border-green-700={result.success}
			class:bg-red-900={!result.success}
			class:border-red-700={!result.success}
		>
			<h2 class="mb-2 text-2xl font-bold">Informe de Misión</h2>
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
		</div>
	{/if}
</div>
