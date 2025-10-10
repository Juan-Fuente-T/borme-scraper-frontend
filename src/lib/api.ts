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