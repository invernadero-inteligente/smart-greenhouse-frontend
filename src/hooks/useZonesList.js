import { useEffect, useState } from "react";
import { zoneService } from "../services/zone.service";

export function useZones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    zoneService
      .listZones(true)
      .then((res) => {
        if (mounted) {
          setZones(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Error cargando zonas");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { zones, loading, error };
}