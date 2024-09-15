export const apiRequest = async (url, method = 'POST', body = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
    console.log(body);
    const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
    });

    return await response.json();
};