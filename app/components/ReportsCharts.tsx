'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

export default function ReportsCharts({
  revenueByDay,
  topItems,
}: {
  revenueByDay: { day: string; revenue: number }[]
  topItems: { name: string; quantity: number }[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-admin-ink">Revenue over time</h2>
        <div className="mt-4 h-64">
          {revenueByDay.length === 0 ? (
            <p className="text-sm text-admin-ink/50">No orders in this range.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByDay}>
                <XAxis dataKey="day" stroke="#1E1E1E80" fontSize={12} />
                <YAxis stroke="#1E1E1E80" fontSize={12} />
                <Tooltip formatter={(value: any) => [`£${Number(value).toFixed(2)}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#FF5722" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-admin-ink">Top items</h2>
        <div className="mt-4 h-64">
          {topItems.length === 0 ? (
            <p className="text-sm text-admin-ink/50">No orders in this range.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#1E1E1E80" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#1E1E1E80" fontSize={12} width={100} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#FF5722" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}