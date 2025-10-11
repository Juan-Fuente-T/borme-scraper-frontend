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
export const getPublications = (page: number = 0, size: number = 20) => {
    return apiClient.get(`/publications?page=${page}&size=${size}`);
};
