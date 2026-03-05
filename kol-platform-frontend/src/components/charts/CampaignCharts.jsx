import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Campaign 1", success: 4 },
  { name: "Campaign 2", success: 3 },
  { name: "Campaign 3", success: 5 },
];

function CampaignChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Campaign Performance</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="success" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CampaignChart;