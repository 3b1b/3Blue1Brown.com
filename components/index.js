import Accordion from "./Accordion";
import Announcement from "./Announcement";
import BlogPostList from "./BlogPostList";
import BookShelf, { Book } from "./BookShelf";
import Center from "./Center";
import Clickable from "./Clickable";
import {
  LicensingForm,
  SpeakingForm,
  ThanksForm,
  ContactForm,
  ContactFormReceivedMessage,
} from "./ContactForms";
import FeatureCard from "./FeatureCard";
import Figure from "./Figure";
import FreeResponse from "./FreeResponse";
import HomepageFeaturedContent, {
  HomepageFeaturedItem,
  HomepageFeaturedVideo,
} from "./HomepageFeaturedContent";
import Interactive from "./Interactive";
import LessonCard from "./LessonCard";
import LessonGallery from "./LessonGallery";
import LessonLink from "./LessonLink";
import Patrons from "./Patrons";
import PiCreature from "./PiCreature";
import PodcastEpisodes from "./PodcastEpisodes";
import PodcastLinks from "./PodcastLinks";
import Portrait from "./Portrait";
import Question from "./Question";
import Section from "./Section";
import Spoiler from "./Spoiler";
import Tooltip from "./Tooltip";
import Twitter from "./Twitter";

// components to automatically import into all .mdx files
const components = {
  Accordion,
  Announcement,
  BlogPostList,
  BookShelf,
  Book,
  Center,
  Clickable,
  ContactForm,
  ContactFormReceivedMessage,
  FeatureCard,
  Figure,
  FreeResponse,
  HomepageFeaturedContent,
  HomepageFeaturedItem,
  HomepageFeaturedVideo,
  Interactive,
  LessonCard,
  LessonGallery,
  LessonLink,
  LicensingForm,
  Patrons,
  PiCreature,
  PodcastEpisodes,
  PodcastLinks,
  Portrait,
  Question,
  Section,
  SpeakingForm,
  Spoiler,
  ThanksForm,
  Tooltip,
  Twitter,
};

export default components;
