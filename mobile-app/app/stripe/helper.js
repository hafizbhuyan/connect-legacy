import { API_URL } from "./config";

export async function fetchPublishableKey() {
    try {
        const response = await fetch(`${API_URL}/config`)
        const { publishableKey } = await response.json()
        return publishableKey
    } catch(e) {
        console.log(e + 'Unable to fetch publishable key.')
    }
}