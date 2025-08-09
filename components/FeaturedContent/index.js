import HomepageFeaturedContent from "../HomepageFeaturedContent";

export default function FeaturedContent({ title = "Featured Content", children }) {
  return (
    <HomepageFeaturedContent 
      title={title} 
      show_latest_video={false}
    >
      {children}
    </HomepageFeaturedContent>
  );
}