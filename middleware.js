import { NextResponse } from 'next/server';

// Social media crawler user agents
const SOCIAL_CRAWLERS = [
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'skypeuripreview',
  'slackbot',
  'discordbot',
  'redditbot',
  'applebot',
  'flipboard',
  'tumblr',
  'pinterest'
];

export function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const url = request.nextUrl.clone();
  
  // Only process requests with video parameter
  if (!url.searchParams.get('v')) {
    return NextResponse.next();
  }
  
  // Check if it's a social media crawler
  const isSocialCrawler = SOCIAL_CRAWLERS.some(crawler => 
    userAgent.toLowerCase().includes(crawler)
  );
  
  // Only handle homepage requests with video parameter
  if (isSocialCrawler && url.pathname === '/') {
    const videoSlug = url.searchParams.get('v');
    
    // Redirect to a special endpoint that renders with proper meta tags
    url.pathname = `/og/${videoSlug}`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Only match homepage requests
     */
    '/',
  ],
};