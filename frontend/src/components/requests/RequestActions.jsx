import { Button } from "@/components/ui/button";
import { assignTechnician, scrapRequest } from "@/api/requests";
import { useAuth } from "@/auth/useAuth";

export default function RequestActions({ request }) {
    const { user } = useAuth();

    if (user.role !== "manager") return null;

    return (
        <div className="flex gap-3">
            <Button
                variant="outline"
                onClick={() => assignTechnician(request.id)}
            >
                Assign Technician
            </Button>

            <Button
                variant="destructive"
                onClick={() => scrapRequest(request.id)}
            >
                Scrap Request
            </Button>
        </div>
    );
}
