import React, { useEffect, useState, useMemo } from "react";
import { Calendar, Users, User } from "lucide-react";
import { api } from "../../api/api";
import { StatCard } from "../../components/StatCard";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load admin dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // ✅ Format chart data
  const chartData = useMemo(() => {
    if (!stats) return { categoryData: [], trendData: [] };

    return {
      categoryData: stats.categories.map((c) => ({
        name: c._id,
        value: c.count
      })),
      trendData: stats.trend.map((t) => ({
        name: t._id,
        registrations: t.count
      }))
    };
  }, [stats]);

  const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Events" value={stats.eventCount} icon={Calendar} />
        <StatCard title="Registrations" value={stats.regCount} icon={Users} />
        <StatCard title="Total Users" value={stats.userCount} icon={User} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow border dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4">Registration Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.trendData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="registrations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow border dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4">Events by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
