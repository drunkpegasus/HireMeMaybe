import { type NextApiRequest, type NextApiResponse } from 'next'; // <-- This is the fix

// Get your backend logging URL from environment variables
const LOGGING_URL = process.env.LOGGING_API_ENDPOINT;

export default async function handler(req: NextApiRequest, res: NextApiResponse) { // <-- This is the fix
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!LOGGING_URL) {
    console.error('LOGGING_API_ENDPOINT is not set');
    return res.status(500).json({ message: 'Logging URL not configured' });
  }

  try {
    // Get page from query parameter (this also changes)
    const page = (req.query.page as string) || '/unknown';
    
    // Get IP and User-Agent from the request
    const visitorIp = req.ip || (req.headers['x-forwarded-for'] as string) || 'IP Not Found';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';

    // Call your Express.js backend
    const urlToFetch = `${LOGGING_URL}?page=${encodeURIComponent(page)}`;
    
    await fetch(urlToFetch, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'x-forwarded-for': visitorIp,
      },
      keepalive: true,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[API /log-visit] Fetch failed:', error);
    res.status(500).json({ message: 'Error logging visit' });
  }
}

// Disable the Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};