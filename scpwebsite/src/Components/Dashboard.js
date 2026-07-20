import React from "react";
import Chart from "react-apexcharts";
import { useAuth } from "../contexts/AuthContext";
import { useDashboardSummary } from "../Hooks/useUtilityQueries";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const peso = (value) =>
  "₱" +
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Visual style per transaction type (badge + initial avatar tint).
const TYPE_STYLE = {
  "New Loan": { color: "#059669", bg: "#D1FAE5" },
  Renewal: { color: "#2563EB", bg: "#DBEAFE" },
  Redemption: { color: "#D97706", bg: "#FEF3C7" },
  "Pull Out": { color: "#DC2626", bg: "#FEE2E2" },
};

const TypeBadge = ({ type }) => {
  const s = TYPE_STYLE[type] || { color: "#475569", bg: "#E2E8F0" };
  return (
    <span
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontSize: "0.72rem",
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: "999px",
        whiteSpace: "nowrap",
      }}
    >
      {type}
    </span>
  );
};

const StatCard = ({ title, value, subtitle, icon, color, accent }) => (
  <div className="col-6 col-xl-3 mb-3">
    <div
      className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white h-100"
      style={{
        boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
          width: 52,
          height: 52,
          backgroundColor: `${accent}1A`,
          color: accent,
        }}
      >
        <i className={`${icon} fs-4`}></i>
      </div>
      <div className="w-100">
        <div className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.03em" }}>
          {title}
        </div>
        <div className="fw-bold" style={{ fontSize: "1.9rem", lineHeight: 1.1, color: "#0F172A" }}>
          {value}
        </div>
        <div className="text-muted" style={{ fontSize: "0.72rem" }}>
          {subtitle}
        </div>
      </div>
    </div>
  </div>
);

const Avatar = ({ name }) => {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
      style={{
        width: 34,
        height: 34,
        backgroundColor: "#EEF2FF",
        color: "#2563EB",
        fontSize: "0.75rem",
        fontWeight: 700,
      }}
    >
      {initials}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const cnCode = user?.cnCode;

  const { data, isLoading, isError, error } = useDashboardSummary(cnCode);

  const monthly = data?.monthly || [];
  const series = monthly.map((s) => ({ name: s.name, data: s.data }));

  // Smooth, rounded gradient area chart.
  const areaOptions = {
    chart: { id: "monthly-transactions", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    colors: ["#059669", "#2563EB", "#D97706"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3, lineCap: "round" },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] },
    },
    grid: { borderColor: "#E2E8F0", strokeDashArray: 4 },
    xaxis: { categories: MONTHS, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => Math.round(v) } },
    legend: { position: "top", horizontalAlign: "right", markers: { radius: 12 } },
    tooltip: { y: { formatter: (val) => Number(val || 0).toLocaleString("en-US") } },
  };

  // Rounded donut of this year's transaction mix.
  const donutTotals = monthly.map((s) => (s.data || []).reduce((a, b) => a + b, 0));
  const donutHasData = donutTotals.some((v) => v > 0);
  const donutOptions = {
    chart: { fontFamily: "Inter, sans-serif" },
    labels: monthly.map((s) => s.name),
    colors: ["#059669", "#2563EB", "#D97706"],
    stroke: { width: 0 },
    legend: { position: "bottom" },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: { show: true, label: "Total", fontWeight: 600, color: "#475569" },
          },
        },
      },
    },
  };

  return (
    <div className="p-3">
      {isLoading && (
        <div className="text-center text-muted py-5">
          <div className="spinner-border text-primary" role="status" />
          <div className="mt-2">Loading dashboard…</div>
        </div>
      )}

      {isError && (
        <div className="alert alert-danger" role="alert">
          Failed to load dashboard data: {error?.message || "Unknown error"}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Stat cards */}
          <div className="row">
            <StatCard
              title="New Loan"
              value={data?.newLoanToday ?? 0}
              subtitle="Transactions (Today)"
              icon="fa-solid fa-file-circle-plus"
              accent="#059669"
            />
            <StatCard
              title="Renewal"
              value={data?.renewalToday ?? 0}
              subtitle="Transactions (Today)"
              icon="fa-solid fa-rotate-left"
              accent="#2563EB"
            />
            <StatCard
              title="Redemption"
              value={data?.redemptionToday ?? 0}
              subtitle="Transactions (Today)"
              icon="fa-solid fa-hand-holding-hand"
              accent="#D97706"
            />
            <StatCard
              title="Pull Out"
              value={data?.pullOutReady ?? 0}
              subtitle="Ready for Auction"
              icon="fa-solid fa-outdent"
              accent="#DC2626"
            />
          </div>

          <div className="row">
            {/* Monthly area chart */}
            <div className="col-12 col-xl-8 mb-3">
              <div className="rounded-3 p-3 bg-white h-100" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.08)" }}>
                <h6 className="fw-bold mb-3" style={{ color: "#0F172A" }}>
                  Monthly Transactions — {new Date().getFullYear()}
                </h6>
                <Chart options={areaOptions} series={series} height={340} type="area" />
              </div>
            </div>

            {/* Donut chart */}
            <div className="col-12 col-xl-4 mb-3">
              <div className="rounded-3 p-3 bg-white h-100" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.08)" }}>
                <h6 className="fw-bold mb-3" style={{ color: "#0F172A" }}>
                  Transaction Mix
                </h6>
                {donutHasData ? (
                  <Chart options={donutOptions} series={donutTotals} height={320} type="donut" />
                ) : (
                  <div className="text-center text-muted py-5">No transactions this year</div>
                )}
              </div>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="row">
            <div className="col-12 mb-3">
              <div className="rounded-3 bg-white h-100" style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.08)" }}>
                <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2">
                  <h6 className="fw-bold mb-0" style={{ color: "#0F172A" }}>
                    Recent Transactions
                  </h6>
                  <span className="badge rounded-pill bg-light text-secondary border">
                    {(data?.recent || []).length} latest
                  </span>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle mb-0" style={{ fontSize: "0.85rem" }}>
                    <thead>
                      <tr className="text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.04em" }}>
                        <th className="ps-3 text-muted fw-semibold border-0">Customer</th>
                        <th className="text-muted fw-semibold border-0">PT No.</th>
                        <th className="text-muted fw-semibold border-0">Type</th>
                        <th className="text-muted fw-semibold border-0">Date</th>
                        <th className="text-muted fw-semibold border-0 text-end pe-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.recent || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4 border-0">
                            No recent transactions
                          </td>
                        </tr>
                      )}
                      {(data?.recent || []).map((t, idx) => (
                        <tr key={`${t.pawnTicket}-${t.type}-${idx}`} style={{ borderTop: "1px solid #F1F5F9" }}>
                          <td className="ps-3 border-0">
                            <div className="d-flex align-items-center gap-2">
                              <Avatar name={t.custName} />
                              <span className="fw-semibold text-truncate" style={{ maxWidth: 240, color: "#0F172A" }}>
                                {t.custName || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="border-0 text-secondary fw-semibold">{t.pawnTicket}</td>
                          <td className="border-0">
                            <TypeBadge type={t.type} />
                          </td>
                          <td className="border-0 text-secondary">{t.tDate}</td>
                          <td className="border-0 text-end pe-3 fw-bold" style={{ color: "#0F172A" }}>
                            {peso(t.cAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
