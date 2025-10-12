import axios from 'axios';

// La URL base de la API de Spring Boot
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/borme',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Función para procesar el BORME de una fecha
export const processBormeForDate = (date: string) => {
    return apiClient.post(`/process?date=${date}`);
};

// Función para obtener todas las compañías con paginación
export const getAllCompanies = (page: number = 0, size: number = 20) => {
    return apiClient.get(`/companies/all?page=${page}&size=${size}`);
};

// Función para obtener una compañia por su ID
export const getCompanyById = (id: number) => {
    return apiClient.get(`/companies/${id}`);
};

// Función para obtener todas las compañías por fecha con paginación
export const getCompaniesByDate = (page: number = 0, size: number = 20, date: string) => {
    return apiClient.get(`/companies?date=${date}&page=${page}&size=${size}`);
};

// Función para obtener todas las publicaciones con paginación
export const getPublications = (page: number = 0, size: number = 20, sort: string = 'publicationDate,desc') => {
    // return apiClient.get(`/publications?page=${page}&size=${size}`);
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort); // <-- Parámetro de ordenación

    return apiClient.get(`/publications?${params.toString()}`);
};

export const searchCompanies = (
    name: string | null,
    admin: string | null,
    solePartner: string | null,
    startDate: string | null,
    endDate: string | null,
    page: number = 0,
    size: number = 20,
    sort: string = 'publication.publicationDate,desc' // <-- Valor por defecto
) => {
    // Construye los parámetros de la URL de forma segura.
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (admin) params.append('admin', admin);
    if (solePartner) params.append('solePartner', solePartner);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort); // <-- Parámetro de ordenación

    return apiClient.get(`/companies/search?${params.toString()}`);
};