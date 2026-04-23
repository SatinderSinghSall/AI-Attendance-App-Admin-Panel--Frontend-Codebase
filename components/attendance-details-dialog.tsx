"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { BASE_URL } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  timestamp: string | null;
  subject: string;
  subjectCode: string;
};

export default function AttendanceDetailsDialog({
  open,
  onClose,
  timestamp,
  subject,
  subjectCode,
}: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!timestamp) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/attendance/details?timestamp=${timestamp}`,
        );

        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timestamp]);

  const present = data.filter((d) => d.is_present).length;
  const total = data.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Attendance Details</DialogTitle>
        </DialogHeader>

        {/* Info */}
        <div className="space-y-1 text-sm">
          <p>
            <b>Subject:</b> {subject}
          </p>
          <p>
            <b>Code:</b> {subjectCode}
          </p>
          <p>
            <b>Total:</b> {total}
          </p>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-4 space-y-2 max-h-64 overflow-auto">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}

            {!loading &&
              data.map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm border-b pb-1"
                >
                  <span>{row.students?.name}</span>
                  <span>{row.is_present ? "✅ Present" : "❌ Absent"}</span>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="text-sm font-medium">
          ✅ {present} / {total} Students
        </div>
      </DialogContent>
    </Dialog>
  );
}
