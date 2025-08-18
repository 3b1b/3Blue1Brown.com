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
  
  // Check if it's a social media crawler
  const isSocialCrawler = SOCIAL_CRAWLERS.some(crawler => 
    userAgent.toLowerCase().includes(crawler)
  );
  
  // Only handle homepage requests with video parameter
  if (isSocialCrawler && url.pathname === '/' && url.searchParams.get('v')) {
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
     * Match homepage requests with video parameter
     */
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};