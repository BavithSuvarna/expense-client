import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#0088FE', '#A020F0'];

const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, outerRadius, percent, index, name } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20; // pushes label outside the pie
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index % COLORS.length]}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={10}
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

export default function CategoryChart({ expenses }) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div style={{ width: '100%', maxWidth: '500px', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={true}
            label={renderCustomizedLabel}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
