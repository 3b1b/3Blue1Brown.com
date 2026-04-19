import type { LanguageCode } from "~/pages/lessons/languages";
import { useState } from "react";
import { Popover } from "@base-ui/react";
import { TranslateIcon } from "@phosphor-icons/react";
import { useAtom } from "jotai";
import Button from "~/components/Button";
import { languages } from "~/pages/lessons/languages";
import { atomWithQuery } from "~/util/atom";

export const languageAtom = atomWithQuery("language");

type Props = { onSelect?: () => void };

export default function LanguageFilter({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useAtom(languageAtom);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={
          <Button
            aria-label="Filter by language"
            color={language ? "light" : "none"}
          >
            <TranslateIcon />
            {language && (
              <span className="text-base">
                {languages[language as LanguageCode]?.title}
              </span>
            )}
          </Button>
        }
      />
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="z-30"
        >
          <Popover.Popup className="flex flex-col overflow-hidden rounded-md bg-white shadow-md transition data-closed:opacity-0 data-ending-style:opacity-0 data-open:opacity-100 data-starting-style:opacity-0">
            <Button
              color={!language ? "light" : "none"}
              className="w-full justify-start"
              onClick={() => {
                setLanguage("");
                setOpen(false);
              }}
            >
              English
            </Button>
            {Object.values(languages).map(({ code, title }) => (
              <Button
                key={code}
                color={language === code ? "light" : "none"}
                className="w-full justify-start"
                onClick={() => {
                  const next = language === code ? "" : code;
                  setLanguage(next);
                  if (next) onSelect?.();
                  setOpen(false);
                }}
              >
                {title}
              </Button>
            ))}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
