import fetch from "cross-fetch";
// The Metaphor class encapsulates the API's endpoints.
export default class Metaphor {
    baseURL;
    headers;
    constructor(apiKey, baseURL = "https://api.metaphor.systems") {
        this.baseURL = baseURL;
        this.headers = new Headers({
            "x-api-key": apiKey,
            "Content-Type": "application/json",
            "User-Agent": "metaphor-node 1.0.19",
        });
    }
    async request(endpoint, method, body) {
        const response = await fetch(this.baseURL + endpoint, {
            method,
            headers: this.headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const message = (await response.json()).error;
            throw new Error(`Request failed with status ${response.status}. ${message}`);
        }
        return await response.json();
    }
    async search(query, options) {
        return await this.request("/search", "POST", { query, ...options });
    }
    async findSimilar(url, options) {
        return await this.request("/findSimilar", "POST", { url, ...options });
    }
    async getContents(ids) {
        if (ids.length === 0) {
            throw new Error("Must provide at least one ID");
        }
        let requestIds;
        if (typeof ids[0] === "string") {
            requestIds = ids;
        }
        else {
            requestIds = ids.map((result) => result.id);
        }
        // Using URLSearchParams to append the parameters to the URL
        const params = new URLSearchParams({ ids: requestIds.join(",") });
        return await this.request(`/contents?${params}`, "GET");
    }
}
