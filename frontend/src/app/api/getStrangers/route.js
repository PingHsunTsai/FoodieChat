export async function GET(req) {

    const backendUrl = process.env.BACKEND_API_URL;
    const { method, headers } = req;
  
    const options = {
        method,
        headers,
    };
  
    try {
        const response = await fetch(`${backendUrl}/api/getStrangers`, options); 
        const data = await response.json();

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Failed to process getStrangers request',
                    error: data.error,
                }),
                {
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
  
        return new Response(
            JSON.stringify({
                success: true,
                message: 'getStrangers successful',
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
  