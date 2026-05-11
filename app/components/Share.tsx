import { ShareNetworkIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { share } from "~/util/url";

// share current page
export default function Share() {
  return (
    <Button className="p-2!" onClick={share} aria-label="Share this page">
      <ShareNetworkIcon />
    </Button>
  );
}
