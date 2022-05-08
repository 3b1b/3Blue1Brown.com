import Accordion from "./Accordion";
import Announcement from "./Announcement";
import BlogPostList from "./BlogPostList";
import BookShelf, { Book } from "./BookShelf";
import Center from "./Center";
import Clickable from "./Clickable";
import Desmos from "./Desmos";
import {
  LicensingForm,
  SpeakingForm,
  ThanksForm,
  ContactForm,
  ContactFormReceivedMessage,
} from "./ContactForms";
import FeatureCard from "./FeatureCard";
import FeaturedContent from "./FeaturedContent";
import Figure from "./Figure";
import FreeResponse from "./FreeResponse";
import HomepageFeaturedContent, {
  HomepageFeaturedItem,
  HomepageFeaturedVideo,
} from "./HomepageFeaturedContent";
import Interactive from "./Interactive/index";
import LessonCard from "./LessonCard";
import LessonGallery from "./LessonGallery";
import LessonLink from "./LessonLink";
import MailList from "./MailList";
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
import Image from "./Image";

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
  Desmos,
  FeatureCard,
  FeaturedContent,
  Figure,
  FreeResponse,
  HomepageFeaturedContent,
  HomepageFeaturedItem,
  HomepageFeaturedVideo,
  Image,
  Interactive,
  LessonCard,
  LessonGallery,
  LessonLink,
  LicensingForm,
  MailList,
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
