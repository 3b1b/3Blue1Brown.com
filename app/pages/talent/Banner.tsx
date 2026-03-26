import { href } from "react-router";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import DarkMode from "~/components/DarkMode";
import Logo from "~/components/Logo";

type Props = {
  name: string;
  banner: string;
  wordmark: string;
};

// big banner at top of partner page
export default function Banner({ name, banner, wordmark }: Props) {
  return (
    <header className="dark relative isolate flex flex-col items-center gap-8 overflow-hidden bg-white px-8 py-30 text-black">
      <img
        src={banner}
        alt=""
        className="absolute inset-0 -z-10 size-full object-cover opacity-25"
      />

      <Button
        to={href("/")}
        size="sm"
        className="absolute top-4 left-4"
        aria-label="Home"
      >
        <Logo className="size-12" />
      </Button>

      <DarkMode className="absolute top-4 right-4" />

      <img src={wordmark} alt={name} title={name} className="h-20" />

      <Button to={href("/talent")} className="absolute bottom-4 left-4">
        <ArrowLeftIcon />
        More 3b1b Partners
      </Button>
    </header>
  );
}
