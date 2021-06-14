import Accordion from "./Accordion";
import Center from "./Center";
import Clickable from "./Clickable";
import Figure from "./Figure";
import GoogleSearch from "./GoogleSearch";
import { H1, H2, H3, H4 } from "./Heading";
import LessonCard from "./LessonCard";
import LessonGallery from "./LessonGallery";
import LessonLink from "./LessonLink";
import Patrons from "./Patrons";
import PiCreature from "./PiCreature";
import Question from "./Question";
import Section from "./Section";
import Spoiler from "./Spoiler";
import Tooltip from "./Tooltip";
import Video from "./Video";

// https://mdxjs.com/table-of-components
import RelLink from "./RelLink";

// components you want to be able to use in .mdx files
const components = {
  Accordion,
  Center,
  Clickable,
  Figure,
  GoogleSearch,
  LessonCard,
  LessonGallery,
  LessonLink,
  Patrons,
  PiCreature,
  Question,
  Section,
  Spoiler,
  Tooltip,
  Video,
  // https://mdxjs.com/table-of-components
  a: RelLink,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
};

export default components;
