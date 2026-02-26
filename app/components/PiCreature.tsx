import type { ComponentProps, FunctionComponent, ReactNode } from "react";
import { useRef, useState } from "react";
import clsx from "clsx";
import SpeechBubble from "~/assets/misc/bubble-speech.svg?react";
import ThoughtBubble from "~/assets/misc/bubble-thought.svg?react";
import Checkbox from "~/components/Checkbox";
import Select from "~/components/Select";
import Textbox from "~/components/Textbox";
import { useSvgFit } from "~/util/hooks";
import { importAssets } from "~/util/import";

type Component = FunctionComponent<ComponentProps<"svg">>;

// import all pi creature emotions
export const [, emotions] = importAssets(
  import.meta.glob<{ default: Component }>("~/assets/pi-creatures/*.svg", {
    eager: true,
    query: "react",
  }),
);

type Props = {
  emotion: string;
  thought?: boolean;
  size?: "sm" | "md";
  flip?: boolean;
  children?: ReactNode;
} & ComponentProps<"svg">;

// pi creature with speech/thought bubble
export default function PiCreature({
  emotion,
  thought,
  size = "md",
  flip,
  className,
  children,
  ...props
}: Props) {
  const creatureRef = useRef<SVGSVGElement | null>(null);
  useSvgFit(creatureRef);

  // lookup emotion component
  const Creature = emotions[emotion]?.default ?? emotions.plain?.default;

  if (!Creature) return null;

  // creature element
  const creature = (
    <Creature
      ref={creatureRef}
      className={clsx(
        "text-theme [grid-area:creature]",
        flip && "-scale-x-100",
        size === "sm" && "size-20",
        size === "md" && "size-30",
        !children && className,
      )}
      {...props}
    />
  );

  // if no bubble content, just render creature
  if (!children) return creature;

  const bubbleClass = clsx(
    "absolute inset-0 -z-10 size-full",
    flip && "-scale-x-100",
  );

  // bubble element
  const bubble = (
    <div
      className={clsx(
        "relative grid place-items-center [grid-area:bubble]",
        size === "sm" && "w-40",
        size === "md" && "w-50",
      )}
    >
      {/* background shape */}
      {thought ? (
        <ThoughtBubble className={bubbleClass} preserveAspectRatio="none" />
      ) : (
        <SpeechBubble className={bubbleClass} preserveAspectRatio="none" />
      )}

      {/* bubble text */}
      <div className="p-6">
        <div className="line-clamp-5 text-center leading-normal *:contents *:leading-normal">
          {children}
        </div>
      </div>
    </div>
  );

  // render bubble and creature in grid
  return (
    <div
      className={clsx(
        "grid max-w-max",
        flip
          ? `[grid-template-areas:'bubble_.'_'._creature']`
          : `[grid-template-areas:'._bubble'_'creature_.']`,
        className,
      )}
    >
      {bubble}
      {creature}
    </div>
  );
}

export function Demo({ children }: { children: ReactNode }) {
  const [emotion, setEmotion] = useState("plain");
  const [thought, setThought] = useState(false);
  const [size, setSize] = useState<Props["size"]>("md");
  const [flip, setFlip] = useState(false);
  const [content, setContent] = useState("");

  return (
    <>
      <PiCreature
        emotion={emotion}
        thought={thought}
        size={size}
        flip={flip}
        className="self-center border"
      >
        {content ? content.trim() : children}
      </PiCreature>

      <div className="grid grid-cols-2 items-end gap-4 max-md:grid-cols-1">
        <label>
          Emotion
          <Select
            value={emotion}
            onChange={setEmotion}
            options={Object.keys(emotions).map((emotion) => ({
              value: emotion,
            }))}
          />
        </label>
        <label>
          Size
          <Select
            value={size}
            onChange={setSize}
            options={(["sm", "md"] as const).map((size) => ({
              value: size,
            }))}
          />
        </label>
        <Textbox
          value={content}
          onChange={setContent}
          placeholder="Bubble content"
          className="col-span-full"
        />
        <Checkbox value={flip} onChange={setFlip}>
          Flip
        </Checkbox>
        <Checkbox value={thought} onChange={setThought}>
          Thought
        </Checkbox>
      </div>
    </>
  );
}
