import Head from 'next/head';
import { lessonMeta } from '../../util/pages';
import * as site from '../../data/site.yaml';

function OGPage({ lesson, notFound }) {
  if (notFound) {
    return (
      <>
        <Head>
          <title>Video Not Found - 3Blue1Brown</title>
          <meta name="robots" content="noindex" />
          <meta httpEquiv="refresh" content="0;url=/" />
        </Head>
        <div>Redirecting...</div>
      </>
    );
  }

  const title = `${lesson.title} - 3Blue1Brown`;
  const description = lesson.description || 'Math videos with a visual approach';
  const imageUrl = lesson.thumbnail;
  const videoUrl = `https://www.3blue1brown.com/?v=${lesson.slug}`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${lesson.video}`;

  // Structured data for Google Search Console
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": lesson.title,
    "description": description,
    "thumbnailUrl": imageUrl,
    "embedUrl": youtubeUrl,
    "contentUrl": youtubeUrl,
    "uploadDate": lesson.date,
    "publisher": {
      "@type": "Organization",
      "name": "3Blue1Brown",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.3blue1brown.com/favicons/android-chrome-512x512.png"
      }
    },
    "url": videoUrl
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={videoUrl} />
        <meta property="og:site_name" content="3Blue1Brown" />
        <meta property="og:video" content={youtubeUrl} />
        <meta property="og:video:type" content="text/html" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:url" content={videoUrl} />
        <meta name="twitter:site" content="@3blue1brown" />
        <meta name="twitter:creator" content="@3blue1brown" />
        <meta name="twitter:player" content={youtubeUrl} />
        <meta name="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" content="720" />
        
        {/* Additional meta tags */}
        <meta property="article:author" content="Grant Sanderson" />
        {lesson.date && <meta property="article:published_time" content={lesson.date} />}
        <meta property="video:duration" content="600" />
        <meta property="video:tag" content="mathematics" />
        <meta property="video:tag" content="education" />
        
        {/* Structured Data for Google Search Console */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        {/* Preload thumbnail for faster social media preview loading */}
        <link rel="preload" href={imageUrl} as="image" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={videoUrl} />
        
        {/* Auto-redirect for regular browsers */}
        <meta httpEquiv="refresh" content={`0;url=${videoUrl}`} />
      </Head>
      
      <div style={{ 
        fontFamily: 'Arial, sans-serif', 
        textAlign: 'center', 
        padding: '50px 20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1>{lesson.title}</h1>
        <p>{description}</p>
        <p>
          <a href={videoUrl} style={{ color: '#0066cc', textDecoration: 'none' }}>
            Watch this video on 3Blue1Brown
          </a>
        </p>
        <p>
          <a href={youtubeUrl} style={{ color: '#ff0000', textDecoration: 'none' }}>
            Watch on YouTube
          </a>
        </p>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Redirect regular browsers immediately
            if (!navigator.userAgent.match(/(facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|skypeuripreview|slackbot|discordbot)/i)) {
              window.location.href = '${videoUrl}';
            }
          `
        }} />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  // Generate paths for all video lessons
  const videoLessons = lessonMeta.filter(lesson => lesson.video && lesson.video.trim() !== '');
  const paths = videoLessons.map(lesson => ({
    params: { slug: lesson.slug }
  }));

  return {
    paths,
    fallback: false // All pages generated at build time
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  
  // Find the lesson with matching slug
  const lesson = lessonMeta.find(lesson => lesson.slug === slug);
  
  if (!lesson || !lesson.video || lesson.video.trim() === '') {
    return {
      props: {
        notFound: true
      },
      revalidate: 3600 // Check again in an hour
    };
  }

  return {
    props: {
      lesson: {
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        thumbnail: lesson.thumbnail,
        video: lesson.video,
        date: lesson.date
      }
    },
    revalidate: 86400 // Revalidate once per day
  };
}

export default OGPage;