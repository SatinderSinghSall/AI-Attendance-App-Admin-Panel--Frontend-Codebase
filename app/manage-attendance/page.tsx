"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { BASE_URL } from "@/lib/api";
import AttendanceDetailsDialog from "@/components/attendance-details-dialog";

export default function ManageAttendancePage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/attendance`);
        const json = await res.json();
        setSessions(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  // 🔥 Load details when clicking
  const loadDetails = async (session: any) => {
    try {
      setSelected(session);
      setLoadingDetails(true);

      const res = await fetch(
        `${BASE_URL}/attendance/details?timestamp=${session.timestamp}`,
      );

      const json = await res.json();
      setDetails(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const present = details.filter((d) => d.is_present).length;
  const total = details.length;
  const percentage = total ? ((present / total) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Header */}
      <div>
        <h2 className="text-2xl font-bold">Manage Attendance</h2>
        <p className="text-muted-foreground text-sm">
          View and manage attendance sessions
        </p>
      </div>

      {/* 📊 Sessions Table */}
      <Card>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loadingSessions &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))}

              {!loadingSessions &&
                sessions.map((s, i) => (
                  <tr key={i} className="border-t hover:bg-muted/40">
                    <td className="p-3">{s.subjects?.name}</td>

                    <td className="p-3 text-muted-foreground">
                      {new Date(s.timestamp).toLocaleString()}
                    </td>

                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelected(s);
                          setOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <AttendanceDetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        timestamp={selected?.timestamp}
        subject={selected?.subjects?.name}
        subjectCode={selected?.subjects?.subject_code}
      />
    </div>
  );
}
