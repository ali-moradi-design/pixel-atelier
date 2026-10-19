import { Badge } from "pixel-atelier/badge";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="accent" dot>
        New
      </Badge>
      <Badge variant="success" dot>
        Live
      </Badge>
      <Badge variant="warning">Beta</Badge>
      <Badge variant="danger">Deprecated</Badge>
      <Badge variant="solid">v1.0</Badge>
    </div>
  );
}
