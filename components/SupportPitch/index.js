import Center from "../Center";
import Clickable from "../Clickable";

// Component containing the support pitch content
export default function SupportPitch() {
  return (
    <>
      <Center>
        <Clickable
          link="https://www.patreon.com/3blue1brown"
          icon="fab fa-patreon"
          text="Become a supporting member"
          design="rounded"
        />
      </Center>

      <p>
        Supporters get early access to new videos and make up the core inner
        audience that provides feedback and insights to refine the final form
        of these lessons.
      </p>

      <p>
        There are other perks, including a meaningful store discount and, for
        the higher-tier patrons, having your name appear in the video.
      </p>

      <p>
        Most of us find it normal to pay for textbooks and to pay (often
        handsomely) for courses. I believe educational videos are most
        valuable when they are free. Although viewers are not obligated
        to pay for them as they would for a textbook or course, I am very
        grateful for those who choose to do so anyway.
      </p>
    </>
  );
}
