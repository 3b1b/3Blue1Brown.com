import Accordion from "./accordion";
import Center from "./center";
import Clickable from "./clickable";
import Figure from "./figure";
import GoogleSearch from "./google-search";
import LessonCard from "./lesson-card";
import Patrons from "./patrons";
import PiCreature from "./pi-creature";
import Question from "./question";
import Section from "./section";
import Spoiler from "./spoiler";
import Video from "./video";

// https://mdxjs.com/table-of-components
import Link from "./link";

// components you want to be able to use in .mdx files
const components = {
  Accordion,
  Center,
  Clickable,
  Figure,
  GoogleSearch,
  LessonCard,
  Patrons,
  PiCreature,
  Question,
  Section,
  Spoiler,
  Video,
  // https://mdxjs.com/table-of-components
  a: Link,
};

export default components;
