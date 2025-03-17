import axios, { AxiosError } from 'axios';
import apiClient from "./api-client" // Adjust the import path as necessary

class BaseService<T> {
    private endpoint: string;
    public isLoading: boolean = false;
    public error: string | null = null;
    private abortController: AbortController | null = null;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    private async request<R>(promise: Promise<R>): Promise<R | null> {
        this.isLoading = true;
        this.error = null;
        this.abortController = new AbortController();

        try {
            const response = await promise;
            return response;
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("Request canceled");
            } else {
                const error = err as AxiosError;
                this.error = (error.response?.data as { message?: string })?.message || "An error occurred";
            }
            return null;
        } finally {
            this.isLoading = false;
        }
    }

    getAll = () => this.request(apiClient.get<T[]>(`/${this.endpoint}`));
    getById = (id: string) => this.request(apiClient.get<T>(`/${this.endpoint}/${id}`));
    create = (data: T) => this.request(apiClient.post<T>(`/${this.endpoint}`, data));
    update = (id: string, data: Partial<T>) =>this.request(apiClient.put<T>(`/${this.endpoint}/${id}`, data));
    delete = (id: string) => this.request(apiClient.delete(`/${this.endpoint}/${id}`));
    like = (id: string) => this.request(apiClient.patch<T>(`/${this.endpoint}/${id}/like`));
    getLikes = (id: string) => this.request(apiClient.get<number>(`/${this.endpoint}/${id}/likes`));

    abort = () => {
        if (this.abortController) {
            this.abortController.abort();
            console.log("Request aborted");
        }
    };
}

export default BaseService;