import styles from "./index.module.scss";

export default function FaqLinks(){
  return (
    <div className={styles.faqLinks}>
        <a href="/faq#manim">Animations</a> 
        <a href="/faq#requests">Topic Requests</a> 
        <a href="/faq#name">"3Blue1Brown" name</a> 
        <a href="/faq#translations">Translations</a> 
        <a href="/faq#licensing">Licensing</a> 
        <a href="/faq#speaking">Speaking</a> 
        <a href="/faq#sponsor">Sponsorships</a> 
        <a href="/faq#talent">3b1b Talent</a> 
        <a href="/faq#music">Music</a> 
        <a href="/faq#recommendations">Recommendations</a> 
        <a href="/faq#math-question">Math question</a> 
        <a href="/faq#unsolved">Math results</a>
        <a href="/faq#advice">Advice for creators</a>
        <a href="/faq#contact">Contact</a>
    </div>
  );
};
