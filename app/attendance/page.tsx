"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fetchAttendance } from "@/lib/api";

type Attendance = {
  id: number;
  timestamp: string;
  subject_id: number;
  student_id: number;
  is_present: boolean;
  students?: { name: string };
  subjects?: { name: string };
};

export default function AttendancePage() {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const load = async () => {
      try {
        const json = await fetchAttendance();

        const list = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : [];

        setData(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 🔍 Filter + Search
  const filtered = useMemo(() => {
    return data.filter((a) => {
      const matchSearch =
        a.students?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.subjects?.name?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        status === "all" ||
        (status === "present" && a.is_present) ||
        (status === "absent" && !a.is_present);

      return matchSearch && matchStatus;
    });
  }, [data, search, status]);

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Attendance</h2>

        <div className="flex gap-2">
          <Input
            placeholder="Search student or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60"
          />

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 📊 Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <h3 className="text-xl font-bold">{data.length}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-green-600">Present</p>
            <h3 className="text-xl font-bold">
              {data.filter((d) => d.is_present).length}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-red-600">Absent</p>
            <h3 className="text-xl font-bold">
              {data.filter((d) => !d.is_present).length}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* 📋 Table */}
      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">Subject ID</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-40" />
                    </td>
                  </tr>
                ))}

              {!loading && paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No results found
                  </td>
                </tr>
              )}

              {!loading &&
                paginated.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-muted/40">
                    <td className="p-3 font-medium">{a.id}</td>

                    <td className="p-3">{a.students?.name}</td>

                    <td className="p-3 text-muted-foreground">
                      {a.subjects?.name}
                    </td>

                    <td className="p-3 text-muted-foreground">
                      {a.student_id}
                    </td>

                    <td className="p-3 text-muted-foreground">
                      {a.subject_id}
                    </td>

                    <td className="p-3">
                      <Badge
                        className={
                          a.is_present
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {a.is_present ? "Present" : "Absent"}
                      </Badge>
                    </td>

                    <td className="p-3 text-muted-foreground">
                      {new Date(a.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
