import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface Answer {
  isCorrect: boolean;
  difficulty: "easy" | "medium" | "hard";
}

interface Attempt {
  answers: Answer[];
}

interface Props {
  attempts: Attempt[];
}

const DifficultyBreakdownChart: React.FC<Props> = ({ attempts }) => {
  const stats = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 },
  };

  attempts.forEach((attempt) => {
    attempt.answers.forEach((ans) => {
      if (["easy", "medium", "hard"].includes(ans.difficulty)) {
        stats[ans.difficulty].total++;
        if (ans.isCorrect) stats[ans.difficulty].correct++;
      }
    });
  });

  const data = (["easy", "medium", "hard"] as const).map((diff) => {
    const { total, correct } = stats[diff];
    const accuracy = total ? Math.round((correct / total) * 100) : 0;

    return {
      difficulty: diff,
      correct,
      incorrect: total - correct,
      accuracy,
      total,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
        <XAxis
          dataKey="difficulty"
          tick={{ fill: "#f8fafc", fontSize: 14 }}
          axisLine={{ stroke: "#334155" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#f8fafc", fontSize: 13 }}
          axisLine={{ stroke: "#334155" }}
          tickLine={false}
          label={{
            value: "Attempts",
            angle: -90,
            position: "insideLeft",
            fill: "#f8fafc",
            fontSize: 12,
          }}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            backgroundColor: "#1e293b",
            borderColor: "#3b82f6",
            color: "#f8fafc",
          }}
          formatter={(value: number, name: string) => {
            const label = name === "correct" ? "Correct" : "Incorrect";
            return [`${value}`, label];
          }}
          labelFormatter={(label) => {
            const entry = data.find(d => d.difficulty === label);
            return entry
              ? `${label.toUpperCase()} - ${entry.accuracy}% accuracy`
              : label;
          }}
        />
        <Bar dataKey="correct" fill="#10b981">
          <LabelList dataKey="accuracy" position="top" formatter={(val) => `${val}%`} fill="#f8fafc" fontSize={12} />
        </Bar>
        <Bar dataKey="incorrect" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DifficultyBreakdownChart;
