import { Link } from "pixelbits/link";

export default function Demo() {
  return (
    <p className="text-sm">
      Read the <Link href="#install">installation guide</Link>, browse{" "}
      <Link variant="pixel" href="#all">
        all components
      </Link>{" "}
      or{" "}
      <Link variant="plain" href="#top">
        go back up
      </Link>
      .
    </p>
  );
}
