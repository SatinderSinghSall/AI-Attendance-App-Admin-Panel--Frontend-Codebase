"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, CalendarCheck, UserCog } from "lucide-react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import { fetchDashboard, fetchAttendance } from "@/lib/api";

type Stats = {
  totalStudents: number;
  totalSubjects: number;
  totalAttendance: number;
};

type Activity = {
  id: number;
  students: { name: string };
  subjects: { name: string };
  is_present: boolean;
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    totalAttendance: 0,
    totalTeachers: 0,
  });

  const [activity, setActivity] = useState<Activity[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stats = await fetchDashboard();
        setStats(stats);

        const list = await fetchAttendance();

        setActivity(list.slice(0, 5));

        const grouped = list.slice(0, 10).map((item: any, i: number) => ({
          name: `Day ${i + 1}`,
          attendance: item.is_present ? 1 : 0,
        }));

        setChartData(grouped);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your AI Attendance System
        </p>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Students"
          value={stats.totalStudents}
          icon={<Users />}
          color="blue"
        />

        <StatCard
          title="Teachers"
          value={stats.totalTeachers}
          icon={<UserCog />}
          color="orange"
        />

        <StatCard
          title="Subjects"
          value={stats.totalSubjects}
          icon={<BookOpen />}
          color="purple"
        />

        <StatCard
          title="Attendance"
          value={stats.totalAttendance}
          icon={<CalendarCheck />}
          color="green"
        />
      </div>

      {/* 📈 Chart + Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 📊 Attendance Trend */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Attendance Trend</h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ⚡ Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>

            <div className="space-y-3">
              {activity.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{a.students?.name}</p>
                    <p className="text-muted-foreground">{a.subjects?.name}</p>
                  </div>

                  <span
                    className={a.is_present ? "text-green-600" : "text-red-600"}
                  >
                    {a.is_present ? "Present" : "Absent"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🎯 Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">System Health</h3>
            <p className="text-sm text-muted-foreground">
              All services running normally. Real-time sync active.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">AI Insight</h3>
            <p className="text-sm text-muted-foreground">
              Attendance patterns show consistent student engagement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* 🔥 Reusable Card */
function StatCard({ title, value, icon, color }: any) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>

        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <div className={`text-${color}-600`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
