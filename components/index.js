import Accordion from "./Accordion";
import Center from "./Center";
import Clickable from "./Clickable";
import Figure from "./Figure";
import GoogleSearch from "./GoogleSearch";
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
};

export default components;
