// src/components/DifficultyBreakdownChart.tsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { TOKENS as T } from "../theme/tokens";

type Diff = "easy" | "medium" | "hard";
interface Answer { isCorrect: boolean; difficulty: Diff; }
interface Attempt { answers: Answer[]; }

interface Props {
  attempts: Attempt[];
  compact?: boolean;            // tighter spacing/fonts
  height?: number | string;     // parent controls height; default 240
}

const axisStroke = "rgba(255,255,255,.25)";
const tickFill = T.colors.textMuted;
const gridStroke = "rgba(255,255,255,.08)";
const green = T.colors.accent;

const Tip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: "rgba(13,15,18,.9)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 12,
        color: "#E6F6EA",
        boxShadow: T.shadows.md,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{String(label).toUpperCase()}</div>
      <div>Accuracy: <strong>{d.accuracy}%</strong></div>
      <div>Correct: <strong>{d.correct}</strong></div>
      <div>Incorrect: <strong>{d.incorrect}</strong></div>
      <div>Total: <strong>{d.total}</strong></div>
    </div>
  );
};

const DifficultyBreakdownChart: React.FC<Props> = ({
  attempts,
  compact = true,
  height = 240,
}) => {
  const data = useMemo(() => {
    const stats: Record<Diff, { total: number; correct: number }> = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 },
    };
    (attempts || []).forEach((att) =>
      (att.answers || []).forEach((a) => {
        if (!a || !(a.difficulty in stats)) return;
        stats[a.difficulty as Diff].total += 1;
        if (a.isCorrect) stats[a.difficulty as Diff].correct += 1;
      })
    );
    return (["easy", "medium", "hard"] as Diff[]).map((d) => {
      const { total, correct } = stats[d];
      const incorrect = total - correct;
      const accuracy = total ? Math.round((correct / total) * 100) : 0;
      return {
        difficulty: d,
        accuracy,               // 0–100
        accuracyLabel: `${accuracy}%`,
        correct,
        incorrect,
        total,
      };
    });
  }, [attempts]);

  const allZero = data.every((d) => d.total === 0);

  return (
    <div role="region" aria-label="Difficulty accuracy" style={{ width: "100%", height }}>
      {allZero ? (
        <div style={{ color: T.colors.textMuted, fontSize: 14, padding: 8 }}>
          No answers yet. Take a quiz to populate this chart.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: compact ? 6 : 12,
              right: compact ? 8 : 12,
              left: compact ? 8 : 12,
              bottom: compact ? 4 : 8,
            }}
            barCategoryGap={compact ? 18 : 24}
          >
            <CartesianGrid stroke={gridStroke} horizontal vertical={false} />

            <YAxis
              type="category"
              dataKey="difficulty"
              tick={{ fill: T.colors.textPrimary, fontSize: compact ? 12 : 13, fontWeight: 700 }}
              axisLine={{ stroke: axisStroke }}
              tickLine={false}
              width={compact ? 70 : 80}
            />

            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: tickFill, fontSize: compact ? 11 : 12 }}
              axisLine={{ stroke: axisStroke }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip cursor={{ fill: "transparent" }} content={<Tip />} />

            {/* Single progress bar + muted track */}
            <Bar
              dataKey="accuracy"
              fill={green}
              radius={[0, 8, 8, 0]}
              maxBarSize={compact ? 22 : 26}
              background={{ fill: "rgba(255,255,255,.10)", radius: 8 }}
            >
              <LabelList
                dataKey="accuracyLabel"
                position="right"
                fill={T.colors.textPrimary}
                fontSize={compact ? 11 : 12}
                style={{ fontWeight: 800 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DifficultyBreakdownChart;
