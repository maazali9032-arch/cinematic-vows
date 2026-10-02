import { createFileRoute } from "@tanstack/react-router";
import { UnavailableFallback } from "@/components/invitation/UnavailableFallback";
export const Route = createFileRoute("/")({ component: EmptyInvitation });
function EmptyInvitation() {
  return (
    <UnavailableFallback
      status="invalid"
      shop={{ name: null, location: null, contact: null, locationUrl: null }}
      currentDate={new Date()}
    />
  );
}
