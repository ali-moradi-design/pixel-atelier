import { Avatar, AvatarGroup } from "pixelbits/avatar";

export default function Demo() {
  return (
    <div className="flex items-center gap-6">
      <Avatar name="Ali Moradi" size="lg" status="online" />
      <Avatar name="Karen Ross" size="lg" fallback="initials" />
      <AvatarGroup max={3}>
        <Avatar name="Noah Kim" />
        <Avatar name="Sara Ahmadi" />
        <Avatar name="Leo Park" />
        <Avatar name="Mina Rahimi" />
      </AvatarGroup>
    </div>
  );
}
