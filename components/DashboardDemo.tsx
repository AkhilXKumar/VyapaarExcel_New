import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Mon', Cash: 4000, UPI: 2400, Card: 2400 },
  { name: 'Tue', Cash: 3000, UPI: 1398, Card: 2210 },
  { name: 'Wed', Cash: 2000, UPI: 9800, Card: 2290 },
  { name: 'Thu', Cash: 2780, UPI: 3908, Card: 2000 },
  { name: 'Fri', Cash: 1890, UPI: 4800, Card: 2181 },
  { name: 'Sat', Cash: 2390, UPI: 3800, Card: 2500 },
  { name: 'Sun', Cash: 3490, UPI: 4300, Card: 2100 },
];

const pieData = [
  { name: 'Cash', value: 400, color: '#10B981' }, // Green
  { name: 'UPI', value: 300, color: '#3B82F6' },  // Blue
  { name: 'Card', value: 300, color: '#F59E0B' }, // Orange
];

const DashboardDemo: React.FC = () => {
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Sales Overview (Live Preview)</h3>
          <p className="text-sm text-slate-500">Sample data visualization from the Sales Tracker Template</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">₹ 1.2L Revenue</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">142 Orders</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm h-64">
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Weekly Revenue Split</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{fill: '#F1F5F9'}}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Cash" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="UPI" stackId="a" fill="#3B82F6" />
              <Bar dataKey="Card" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm h-64 flex flex-col items-center justify-center">
            <h4 className="text-xs font-semibold text-slate-400 uppercase w-full text-left mb-2">Payment Mode Share</h4>
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
             <div className="flex gap-4 text-xs text-slate-600 mt-2">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Cash</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>UPI</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Card</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemo;