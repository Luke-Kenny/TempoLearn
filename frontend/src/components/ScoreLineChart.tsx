import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
} from "recharts";
import { TOKENS as T } from "../theme/tokens";

type Attempt = { percentage?: number; [k: string]: any };

interface Props {
  attempts: Attempt[];
  height?: number | string;   // parent can override; default 320
  compact?: boolean;          // slightly smaller ticks/margins
  target?: number;            // optional horizontal target, e.g., 80
  movingAvgWindow?: number;   // optional SMA window (e.g., 3 or 5)
}

/* ----------------------------- helpers ----------------------------- */
function sma(values: number[], window: number) {
  if (!window || window <= 1) return values.map((v) => v ?? null);
  const out: (number | null)[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1).filter((v) => typeof v === "number");
    out.push(slice.length ? Math.round(slice.reduce((a, b) => a + b, 0) / slice.length) : null);
  }
  return out;
}

/* --------------------------- tooltip UI ---------------------------- */
const Tip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload.find((x: any) => x.dataKey === "score");
  if (!p) return null;
  const row = p.payload;
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
        maxWidth: 220,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{row.name}</div>
      <div>Score: <strong>{row.score}%</strong></div>
      {"delta" in row && row.delta != null && (
        <div>
          Change:{" "}
          <strong style={{ color: row.delta > 0 ? T.colors.accent : "#ff4d4d" }}>
            {row.delta > 0 ? "+" : ""}{row.delta}%
          </strong>
        </div>
      )}
      {"sma" in row && row.sma != null && (
        <div>Avg ({row.smaWindow}): <strong>{row.sma}%</strong></div>
      )}
    </div>
  );
};

/* ------------------------------ chart ------------------------------ */
const ScoreLineChart: React.FC<Props> = ({
  attempts,
  height = 320,
  compact = false,
  target,
  movingAvgWindow = 0,
}) => {
  const data = useMemo(() => {
    const raw = (attempts || []).map((a) => Math.max(0, Math.min(100, a?.percentage ?? 0)));
    const smaSeries = movingAvgWindow ? sma(raw, movingAvgWindow) : [];
    return raw.map((score, i) => {
      const prev = i > 0 ? raw[i - 1] : null;
      return {
        name: `Quiz ${i + 1}`,
        score,
        delta: prev == null ? null : Math.round(score - prev),
        sma: movingAvgWindow ? smaSeries[i] : null,
        smaWindow: movingAvgWindow || undefined,
      };
    });
  }, [attempts, movingAvgWindow]);

  const allEmpty = !data.length;

  const axisStroke = "rgba(255,255,255,.25)";
  const tickFill = T.colors.textMuted;
  const gridStroke = "rgba(255,255,255,.08)";
  const lineColor = T.colors.accent;
  const avgColor = "rgba(255,255,255,.65)";

  // Keep labels horizontal & readable: show first, last, and evenly spaced in-between.
  const maxLabels = compact ? 6 : 8;
  const step = Math.max(1, Math.ceil(data.length / maxLabels));
  const tickFormatter = (_: string, index: number) => {
    const isFirst = index === 0;
    const isLast = index === data.length - 1;
    return isFirst || isLast || index % step === 0 ? data[index].name : "";
  };

  return (
    <div role="region" aria-label="Score over time chart" style={{ width: "100%", height }}>
      {allEmpty ? (
        <div style={{ color: T.colors.textMuted, fontSize: 14, padding: 8 }}>
          No attempts yet. Take a quiz to see your progress here.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            // extra right/bottom so last tick + dot never clip
            margin={{ top: compact ? 6 : 10, right: 28, left: 0, bottom: 18 }}
          >
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.28} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke={gridStroke} vertical={false} />

            <XAxis
              dataKey="name"
              stroke={axisStroke}
              axisLine={{ stroke: axisStroke }}
              tickLine={false}
              interval={0}              // draw a tick per point
              tickMargin={10}
              height={28}
              padding={{ left: 0, right: 18 }} // breathing room for last tick
              tickFormatter={tickFormatter}    // label a smart subset only
              tick={{
                fill: T.colors.textPrimary,
                fontSize: compact ? 12 : 13,
                fontWeight: 700,
                fontFamily:
                  'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                letterSpacing: 0.2,
              }}
            />

            <YAxis
              domain={[0, 100]}
              stroke={axisStroke}
              axisLine={{ stroke: axisStroke }}
              tickLine={false}
              tick={{ fill: tickFill, fontSize: compact ? 11 : 12 }}
              tickMargin={6}
              ticks={[0, 25, 50, 75, 100]}
            />

            {typeof target === "number" && (
              <ReferenceLine
                y={target}
                stroke="rgba(255,255,255,.25)"
                strokeDasharray="4 4"
                label={{
                  value: `Target ${target}%`,
                  position: "insideTopRight",
                  fill: tickFill,
                  fontSize: 11,
                }}
              />
            )}

            <Tooltip content={<Tip />} cursor={{ stroke: "rgba(255,255,255,.25)", strokeWidth: 1 }} />

            {/* Subtle area under the main line */}
            <Area type="monotone" dataKey="score" stroke="none" fill="url(#scoreFill)" isAnimationActive={false} />

            {/* Main score line */}
            <Line
              type="monotone"
              dataKey="score"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 1, stroke: "#d7e6d7" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Optional moving average */}
            {movingAvgWindow > 1 && (
              <Line
                type="monotone"
                dataKey="sma"
                stroke={avgColor}
                strokeDasharray="6 6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ScoreLineChart;
