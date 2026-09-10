'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const PIE_COLORS = ['#FF5722', '#FFA07A', '#FFCCBC', '#E53935', '#4CAF50']

export default function DashboardCharts({
  revenueByHour,
  topItems,
}: {
  revenueByHour: { hour: string; revenue: number }[]
  topItems: { name: string; quantity: number }[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-admin-ink">Today's revenue</h2>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueByHour}>
              <XAxis dataKey="hour" stroke="#1E1E1E80" fontSize={12} />
              <YAxis stroke="#1E1E1E80" fontSize={12} />
              <Tooltip formatter={(value: any) => [`£${Number(value).toFixed(2)}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#FF5722" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-admin-ink">Top selling items</h2>
        <div className="mt-4 h-56">
          {topItems.length === 0 ? (
            <p className="text-sm text-admin-ink/50">No orders yet today.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topItems} dataKey="quantity" nameKey="name" outerRadius={80} innerRadius={45}>
                  {topItems.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}