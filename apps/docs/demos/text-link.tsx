import Link from "next/link";
import { TextLink } from "pixelbits/text-link";

export default function Demo() {
  return (
    <p className="text-sm">
      Read the <TextLink href="#install">installation guide</TextLink>, browse{" "}
      <TextLink variant="pixel" asChild>
        <Link href="/docs/">all components</Link>
      </TextLink>{" "}
      or{" "}
      <TextLink variant="plain" href="#top">
        go back up
      </TextLink>
      .
    </p>
  );
}
