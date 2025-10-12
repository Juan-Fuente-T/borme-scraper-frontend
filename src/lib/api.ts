import axios from 'axios';
// import { get } from 'svelte/store';

let basicAuthToken: string | null = null;


// La URL base de la API de Spring Boot
const apiClient = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL + '/api/borme',
    baseURL: 'http://localhost:8080/api', // O la variable de entorno
    headers: { 'Content-Type': 'application/json' }
});

// Se ejecuta ANTES de cada puta petición.
apiClient.interceptors.request.use(
    (config) => {
        if (basicAuthToken) {
            config.headers['Authorization'] = `Basic ${basicAuthToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Función de configuración de credenciales. Se llamará desde su página de login.
 */
export function setAuthCredentials(username: string, password: string) {
    if (username && password) {
        basicAuthToken = btoa(`${username}:${password}`); // Codifica a Base64
    } else {
        basicAuthToken = null; // Limpia las credenciales (logout)
    }
}
/**
 * Intenta hacer una llamada al endpoint protegido para VERIFICAR credenciales almacenadas son válidas.
 * Si las credenciales son incorrectas se recibirá un 401
 */
export const verifyLogin = () => {
    return apiClient.get('/auth/me');
};

// Función para procesar el BORME de una fecha
export const processBormeForDate = (date: string) => {
    return apiClient.post(`/borme/process?date=${date}`);
};

// Función para obtener todas las compañías con paginación
export const getAllCompanies = (page: number = 0, size: number = 20) => {
    return apiClient.get(`/borme/companies/all?page=${page}&size=${size}`);
};

// Función para obtener una compañia por su ID
export const getCompanyById = (id: number) => {
    return apiClient.get(`/borme/companies/${id}`);
};

// Función para obtener todas las compañías por fecha con paginación
export const getCompaniesByDate = (date: string, page: number = 0, size: number = 20, sort: string = 'startDate,desc') => {
    // return apiClient.get(`/companies?date=${date}&page=${page}&size=${size}`);
    const params = new URLSearchParams();
    params.append('date', date);
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort);
    return apiClient.get(`/borme/companies?${params.toString()}`);
};

// Función para obtener todas las publicaciones con paginación
export const getPublications = (page: number = 0, size: number = 20, sort: string = 'publicationDate,desc') => {
    // return apiClient.get(`/publications?page=${page}&size=${size}`);
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort); // <-- Parámetro de ordenación

    return apiClient.get(`/borme/publications?${params.toString()}`);
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

    return apiClient.get(`/borme/companies/search?${params.toString()}`);
};

// export async function login(username: string, password: string) {
//     const credentials = btoa(`${username}:${password}`);

//     const response = await fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Basic ${credentials}`,
//             'Content-Type': 'application/json'
//         }
//     });
    
//     if (response.ok) {
//         return { success: true, token: credentials, data: await response.json() };
//     }
    
//     return { success: false, data: await response.json() };
// }

// function getAuthHeaders() {
//     const token = get(authToken);
//     if (token) {
//         return {
//             'Authorization': `Basic ${token}`,
//             'Content-Type': 'application/json'
//         };
//     }
//     return {
//         'Content-Type': 'application/json'
//     };
// }