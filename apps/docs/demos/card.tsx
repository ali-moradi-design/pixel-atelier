import { Badge } from "pixelbits/badge";
import { Button } from "pixelbits/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from "pixelbits/card";

export default function Demo() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      {/* Shortcut props */}
      <Card
        interactive
        media={
          <div className="h-32 bg-[linear-gradient(180deg,#1d1a2b,#7a4a3a_60%,#e2a36a)]" />
        }
        eyebrow="Case study"
        title="Atelier Noir"
        description="A fashion house site built on the kit."
      />
      {/* Composition: the same parts, in any order */}
      <Card interactive>
        <CardMedia>
          <div className="h-32 bg-[linear-gradient(180deg,#10201b,#2f5d4c_60%,#9fd3b7)]" />
        </CardMedia>
        <CardHeader>
          <CardEyebrow>Component</CardEyebrow>
          <CardTitle>Pixel button</CardTitle>
          <CardDescription>The signature hover dissolve.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-1 text-[0.8125rem] text-pb-muted">
            <li>2 kB brotli</li>
            <li>Keyboard focus runs the effect too</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Badge variant="success" dot>
            Stable
          </Badge>
          <Button size="sm" variant="ghost" className="ms-auto">
            Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
