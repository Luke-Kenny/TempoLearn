import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ScoreLineChart = ({ attempts }: { attempts: any[] }) => {
  const data = attempts.map((a, i) => ({
    name: `Quiz ${i + 1}`,
    score: a.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
        <XAxis dataKey="name" tick={{ fill: "#f1f5f9" }} />
        <YAxis domain={[0, 100]} tick={{ fill: "#f1f5f9" }} />
        <Tooltip
        contentStyle={{ backgroundColor: "#1e293b", borderColor: "#3b82f6", color: "#f8fafc" }}
        />
        <Line
        type="monotone"
        dataKey="score"
        stroke="#3b82f6"
        strokeWidth={3}
        dot={{ r: 4 }}
        />
    </LineChart>
</ResponsiveContainer>

  );
};

export default ScoreLineChart;
