import type { LanguageCode } from "~/pages/lessons/languages";
import { useState } from "react";
import { Popover } from "@base-ui/react";
import { TranslateIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { languages } from "~/pages/lessons/languages";
import { atomWithQuery } from "~/util/atom";

export const languageAtom = atomWithQuery("language");

export default function LanguageFilter() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useAtom(languageAtom);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={
          <button
            aria-label="Filter by language"
            className={clsx(
              "rounded-md p-3 text-lg hocus:bg-theme/15 hocus:text-theme",
              language && "bg-theme/15 text-theme",
            )}
          >
            <TranslateIcon />
            {language && (
              <span className="font-sans text-base">
                {languages[language as LanguageCode]?.title}
              </span>
            )}
          </button>
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
            {Object.values(languages).map(({ code, title }) => (
              <button
                key={code}
                className={clsx(
                  "px-5 py-3 text-left font-sans hocus:bg-theme/15 hocus:text-theme",
                  language === code && "bg-theme/15 font-medium text-theme",
                )}
                onClick={() => {
                  setLanguage(language === code ? "" : code);
                  setOpen(false);
                }}
              >
                {title}
              </button>
            ))}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export const getLanguage = (code: string) =>
  code ? languages[code as LanguageCode] : undefined;
