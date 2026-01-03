import { useState } from "react";
import { Button } from "@/components/ui/button";
import { scrapRequest } from "@/api/requests";
import { toast } from "sonner";

export default function RequestActions({ request, onUpdated }) {
    const [loading, setLoading] = useState(false);

    const handleScrap = async () => {
        setLoading(true);
        try {
            await scrapRequest(request.id);
            toast.success("Request scrapped");
            onUpdated?.();
        } catch {
            toast.error("Failed to scrap request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-3">
            <Button
                variant="destructive"
                onClick={handleScrap}
                disabled={loading}
            >
                {loading ? "Scrapping..." : "Scrap Request"}
            </Button>
        </div>
    );
}
