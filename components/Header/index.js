import { useState } from "react";
import Link from "next/link";
import Background from "./background";
import Tooltip from "../Tooltip";
import Logo from "../Logo";
import { title } from "../../data/site.yaml";
import styles from "./index.module.scss";

// header component to show at top of every page
const Header = ({ light = false }) => {
  // It used to be the case that the header was larger
  // for the home page. If we decide to stick with a
  // universally small one, this option should probably
  // just be removed.
  const big = false;

  if (light) {
    return (
      <header className={styles.header} data-light="true">
        <Link href="/" className={styles.logoOnly}>
          <Logo big={false} />
        </Link>
      </header>
    );
  }

  return (
    <header className={styles.header} data-big={big}>
      <Background />
      <Title big={big} />
      <Nav />
    </header>
  );
};

export default Header;

// site title with logo and text stack
const Title = ({ big }) => (
  (<Link href="/" className={styles.title}>

    <Logo big={big} />
    <div className={styles.textStack}>
      <Text />
      <Tagline />
    </div>

  </Link>)
);

// site title text
const Text = () => (
  <span className={styles.text}>
    {title.split("").map((char, index) => (
      <span key={index}>{char}</span>
    ))}
  </span>
);

// animated tagline text
const Tagline = () => (
  <span className={styles.tagline}>
    {"Animated math".split("").map((char, index) => (
      <span key={index}>{char === " " ? "\u00A0" : char}</span>
    ))}
  </span>
);

// navigation bar with links
const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav} data-open={open}>
      <button className={styles.button} onClick={() => setOpen(!open)}>
        <i className={open ? "fas fa-times" : "fas fa-bars"}></i>
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      <NavLink
        link="/talent"
        text="Talent"
      />
      <NavLink
        link="https://www.patreon.com/c/3blue1brown"
        text="Patreon"
      />
      <NavLink
        link="https://store.dftba.com/collections/3blue1brown"
        text="Store"
      />
      <NavLink link="/blog" text="Blog"/>
      <NavLink link="/extras" text="Extras"/>
      <NavLink
        link="/faq"
        text="FAQ/Contact"
      />
      <NavLink
        link="/about"
        text="About"
      />
    </nav>
  );
};

// nav bar link
const NavLink = ({ link, text, icon, tooltip }) => (
  <Link href={link} passHref legacyBehavior>
    <Tooltip content={tooltip}>
      <a className={styles.link}>
        {text}
        {icon && <i className={icon} />}
      </a>
    </Tooltip>
  </Link>
);
