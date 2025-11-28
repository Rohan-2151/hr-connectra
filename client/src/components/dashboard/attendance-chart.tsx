import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  {
    name: "Mon",
    hours: 8.5,
  },
  {
    name: "Tue",
    hours: 9.2,
  },
  {
    name: "Wed",
    hours: 8.0,
  },
  {
    name: "Thu",
    hours: 8.8,
  },
  {
    name: "Fri",
    hours: 7.5,
  },
  {
    name: "Sat",
    hours: 0,
  },
  {
    name: "Sun",
    hours: 0,
  },
];

export function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))', 
            borderRadius: '8px', 
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Bar
          dataKey="hours"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
