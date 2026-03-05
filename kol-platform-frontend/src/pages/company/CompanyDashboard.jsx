import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const spendingData = [
  { month: "Jan", spent: 4000 },
  { month: "Feb", spent: 6200 },
  { month: "Mar", spent: 5100 },
  { month: "Apr", spent: 7800 },
  { month: "May", spent: 9200 },
  { month: "Jun", spent: 8400 },
];

function CompanyDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Welcome back 
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Active Campaigns</p>
          <h3 className="text-2xl font-bold mt-2">12</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Budget Spent</p>
          <h3 className="text-2xl font-bold mt-2">$24,000</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">KOLs Hired</p>
          <h3 className="text-2xl font-bold mt-2">38</h3>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Budget Spending Over Time
        </h3>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="spent"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;