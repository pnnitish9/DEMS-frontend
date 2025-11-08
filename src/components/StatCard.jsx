import React from "react";

export function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-950 shadow rounded-lg border dark:border-gray-800">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
        </div>

        {Icon && <Icon className="w-10 h-10 text-indigo-600" />}
      </div>
    </div>
  );
}
