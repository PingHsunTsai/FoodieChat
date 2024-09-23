import { cookies } from "next/headers";

export async function POST(req) {
  cookies().delete("session");
  return new Response(
    JSON.stringify({
        success: true,
        message: 'Logout successful',
    }),
    {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    }
);
}