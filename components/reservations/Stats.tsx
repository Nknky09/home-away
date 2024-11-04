import StatsCard from "@/components/admin/StatsCard";
import { fetchReservationStats } from "../../app/utils/actions";
import { formatCurrency } from "../../app/utils/format";

async function Stats() {
  const stats = await fetchReservationStats();

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-4 lg:grid-cols-3">
      <StatsCard title="properties" value={stats.properties} />
      <StatsCard title="nights" value={stats.nights} />
      <StatsCard title="total" value={formatCurrency(stats.amount)} />
    </div>
  );
}

export default Stats;
