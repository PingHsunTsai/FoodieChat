export const apiRequest = async (url, method = 'POST', body = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),  // Include Authorization header if token is present
    };

    const options = {
        method,
        headers,
        ...(method !== 'GET' && { body: JSON.stringify(body) }) 
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || ' Frontend API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error.message);
        throw error;
    }
};

export const handleLogout = (router) => {
    localStorage.removeItem('token');
    router.push('/auth/login');
};