export async function GET(req) {

    const backendUrl = process.env.BACKEND_API_URL;
    const { method, headers } = req;
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get('userId');
    const receiverId = searchParams.get('receiverId');

    const options = {
        method,
        headers,
    };

    try {
        const response = await fetch(
            `${backendUrl}/api/streamMsg/${userId}?receiverId=${receiverId}`,
             options); 

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

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
  