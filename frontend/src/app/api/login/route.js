import { cookies } from 'next/headers'
export async function POST(req) {

    const backendUrl = process.env.BACKEND_API_URL;
    const body = await req.json();
    const { method, headers } = req;
  
    const options = {
        method,
        headers,
        body: JSON.stringify(body),
    };
  
    try {
        const response = await fetch(`${backendUrl}/api/login`, options); 
        const data = await response.json();

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Failed to process login request',
                    error: data.error,
                }),
                {
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000)
        cookies().set('session', data.token, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'lax',
            path: '/',
          })

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Login successful',
                data,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );

    } catch (error) {
        console.error('API request error:', error.message);

        return new Response(
            JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.message,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
  };
  