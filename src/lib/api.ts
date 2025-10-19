import axios from 'axios';

let basicAuthToken: string | null = null;

// La URL base de la API de Spring Boot
const apiClient = axios.create({
    // baseURL: 'http://localhost:8080/api', // O la variable de entorno
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
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

/**
 * Función para procesar el BORME de una fecha
 */
export const processBormeForDate = (date: string) => {
    return apiClient.post(`/borme/process?date=${date}`);
};

/**
 * Función para obtener todas las compañías con paginación
 */
export const getAllCompanies = (page: number = 0, size: number = 20) => {
    return apiClient.get(`/borme/companies/all?page=${page}&size=${size}`);
};

/**
 * Función para obtener una compañia por su ID
 */
export const getCompanyById = (id: number) => {
    return apiClient.get(`/borme/companies/${id}`);
};

/**
 * Función para obtener todas las compañías por fecha con paginación
 */
export const getCompaniesByDate = (date: string, page: number = 0, size: number = 20, sort: string = 'startDate,desc') => {
    // return apiClient.get(`/companies?date=${date}&page=${page}&size=${size}`);
    const params = new URLSearchParams();
    params.append('date', date);
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort);
    return apiClient.get(`/borme/companies?${params.toString()}`);
};

/**
 * Función para obtener todas las publicaciones con paginación
 */
export const getPublications = (page: number = 0, size: number = 20, sort: string = 'publicationDate,desc') => {
    // return apiClient.get(`/publications?page=${page}&size=${size}`);
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort); // <-- Parámetro de ordenación

    return apiClient.get(`/borme/publications?${params.toString()}`);
};

/**
 * Pide los bytes de un PDF como un 'blob' binario.
 */
export const getPublicationPdf = (id: number) => {
    return apiClient.get(`/borme/publications/proxy/${id}`, {
        responseType: 'blob' // <-- Trae los datos en bruto
    });
};

/**
 * Funcion para obtener todas las compañías con filtros de búsqueda y paginación
 */
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