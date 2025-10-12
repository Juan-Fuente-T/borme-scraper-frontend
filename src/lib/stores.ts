import { writable } from 'svelte/store';

// ==================== INTERFACES ====================
interface Company {
    bormeId: string;
    name: string;
    object: string;
    capital: string;
    startDate: string;
}
interface Publication {
    id: number;
    filename: string;
    publicationDate: string;
    fileUrl: string;
}

export interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
}

// ==================== STORES GLOBALES ====================
// Lista de compañías
export const companies = writable<Company[]>([]);

// Lista de publicaciones
export const publications = writable<Publication[]>([]);

// Controla estado de carga de datos
export const isLoading = writable(false);

// Guarda cualquier mensaje de error
export const errorMessage = writable<string | null>(null);

// ==================== FACTORY DE PAGINACIÓN ====================
export function createPaginationStore(initialPageSize: number = 20) {
    const { subscribe, set, update } = writable<PaginationState>({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: initialPageSize
    });

    return {
        subscribe,
        updateFromResponse: (data: { currentPage: number; totalPages: number; total: number }) => {
            update(s => ({
                ...s,
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                totalElements: data.total
            }));
        },
        nextPage: (callback: (page: number) => void) => {
            update(s => {
                if (s.currentPage < s.totalPages - 1) {
                    const newPage = s.currentPage + 1;
                    callback(newPage);
                }
                return s;
            });
        },
        prevPage: (callback: (page: number) => void) => {
            update(s => {
                if (s.currentPage > 0) {
                    const newPage = s.currentPage - 1;
                    callback(newPage);
                }
                return s;
            });
        },
        reset: () => set({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            pageSize: initialPageSize
        })
    };
}