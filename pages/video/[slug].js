import { lessonMeta } from '../../util/pages';
import Head from 'next/head';
import { useEffect, Component } from 'react';
import { useRouter } from 'next/router';

// Error boundary component for video pages
class VideoPageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Video page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Head>
            <title>Error Loading Video - 3Blue1Brown</title>
            <meta name="description" content="There was an error loading this video." />
          </Head>
          <div>
            <h1>Something went wrong</h1>
            <p>There was an error loading this video. Redirecting to homepage...</p>
            <script dangerouslySetInnerHTML={{
              __html: `setTimeout(() => window.location.href = '/', 2000);`
            }} />
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

function VideoPageContent({ lesson, notFound }) {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to homepage with video parameter for human users
    if (lesson && !notFound) {
      router.replace(`/?v=${lesson.slug}`);
    } else {
      router.replace('/');
    }
  }, [lesson, notFound, router]);
  
  // This page exists primarily for social media crawlers
  // Human users will be redirected to the main homepage
  
  if (notFound) {
    return (
      <>
        <Head>
          <title>Video Not Found - 3Blue1Brown</title>
          <meta name="description" content="The requested video could not be found." />
        </Head>
        <div>Video not found. Redirecting...</div>
      </>
    );
  }
  
  if (!lesson) {
    return <div>Loading...</div>;
  }
  
  const title = lesson.title ? `${lesson.title} - 3Blue1Brown` : '3Blue1Brown';
  const description = lesson.description || 'Mathematical animations and explanations by 3Blue1Brown';
  const thumbnail = lesson.thumbnail || '/favicons/share-thumbnail.jpg';
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:type" content="video" />
        <meta property="og:url" content={`https://3blue1brown.com/video/${lesson.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={thumbnail} />
        <meta property="og:video:url" content={`https://www.youtube.com/watch?v=${lesson.video}`} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://3blue1brown.com/video/${lesson.slug}`} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={thumbnail} />
      </Head>
      <div>
        <h1>{lesson.title}</h1>
        <p>Redirecting to video...</p>
      </div>
    </>
  );
}

export default function VideoPage(props) {
  return (
    <VideoPageErrorBoundary>
      <VideoPageContent {...props} />
    </VideoPageErrorBoundary>
  );
}

export async function getStaticPaths() {
  // Generate paths for all lessons that have videos
  const paths = lessonMeta
    .filter(lesson => lesson.video && lesson.video.trim() !== '')
    .map(lesson => ({
      params: { slug: lesson.slug }
    }));
  
  return {
    paths,
    fallback: false // 404 for non-existent videos
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  
  // Find the lesson with the matching slug
  const lesson = lessonMeta.find(lesson => lesson.slug === slug);
  
  if (!lesson || !lesson.video || lesson.video.trim() === '') {
    return {
      props: {
        notFound: true
      }
    };
  }
  
  return {
    props: {
      lesson
    }
  };
}