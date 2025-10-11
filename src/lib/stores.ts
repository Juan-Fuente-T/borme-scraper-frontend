import { writable } from 'svelte/store';

interface Company {
    bormeId: string;
    name: string;
    object: string;
    startDate: string;
}
interface Publication {
    id: number;
    filename: string;
    publicationDate: string;
    fileUrl: string;
}

// Un store para mantener la lista de compañías
export const companies = writable<Company[]>([]);

// Un store para mantener la lista de publicaciones
export const publications = writable<Publication[]>([]);

// Un store para saber si estamos cargando datos
export const isLoading = writable(false);

// Un store para guardar cualquier mensaje de error
export const errorMessage = writable<string | null>(null);