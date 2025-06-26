
import { Component } from 'react';

const SERVER_URL = 'http://localhost:3000/';

class APIRequests extends Component {

    static async getRequest(restUrl) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'GET',
            credentials: 'include',
            headers: this.buildHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the request';
            throw new Error(errorMessage);
        }

        return data;
    }

    static async postRequest(restUrl, objectToAdd) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'POST',
            credentials: 'include',
            headers: this.buildHeaders(),
            body: JSON.stringify(objectToAdd),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the request';
            throw new Error(errorMessage);
        }

        return data;
    }

    static async postFormData(restUrl, formData) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the request';
            throw new Error(errorMessage);
        }

        return data;
    }

    static async putFormData(restUrl, formData) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the request';
            throw new Error(errorMessage);
        }

        return data;
    }

    static async putRequest(restUrl, objectToUpdate) {
    const response = await fetch(`${SERVER_URL}${restUrl}`, {
        method: 'PUT',
        credentials: 'include',
        headers: this.buildHeaders(),
        body: JSON.stringify(objectToUpdate),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data?.error || 'An error occurred during the PUT request';
        throw new Error(errorMessage);
    }

    return data;
}

    static async patchRequest(restUrl, fieldsToUpdate) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: this.buildHeaders(),
            body: JSON.stringify(fieldsToUpdate),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the request';
            throw new Error(errorMessage);
        }

        return data;
    }

    static async deleteRequest(restUrl) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this.buildHeaders(false)
        });
        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred';
            throw new Error(errorMessage);
        }

        return data
    }

    static buildHeaders(contentType = true) {
        const token = sessionStorage.getItem("token");
        const headers = {};

        if (contentType) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }
    static async formPatch(restUrl, formData) {
        const response = await fetch(`${SERVER_URL}${restUrl}`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data?.error || 'An error occurred during the PATCH request';
            throw new Error(errorMessage);
        }

        return data;
    }

}

export default APIRequests;
