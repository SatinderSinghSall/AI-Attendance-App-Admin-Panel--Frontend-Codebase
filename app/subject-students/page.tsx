"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Subject = {
  subject_id: number;
  name: string;
};

type Student = {
  id: number;
  name: string;
};

export default function SubjectStudentsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // 🔥 Fetch subjects
  useEffect(() => {
    fetch("http://localhost:5000/api/subjects")
      .then((res) => res.json())
      .then((json) => setSubjects(json.data || []))
      .catch(console.error);
  }, []);

  // 🔥 Fetch students
  useEffect(() => {
    if (!selectedSubject) return;

    setLoading(true);

    fetch(
      `http://localhost:5000/api/subject-students/subject/${selectedSubject}`,
    )
      .then((res) => res.json())
      .then((json) => {
        const list = json.data || [];

        const formatted = list.map((item: any) => ({
          id: item.students?.id,
          name: item.students?.name,
        }));

        setStudents(formatted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedSubject]);

  // 🔍 Filter
  const filtered = useMemo(() => {
    return students.filter((s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Subjects & Students</h2>

        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64"
        />
      </div>

      {/* 🔽 Subject Select */}
      <div className="max-w-sm">
        <Select
          value={selectedSubject}
          onValueChange={(value) => {
            setSelectedSubject(value);
            setPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>

          <SelectContent>
            {subjects.map((sub) => (
              <SelectItem key={sub.subject_id} value={String(sub.subject_id)}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 📊 Stats */}
      {selectedSubject && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <h3 className="text-xl font-bold">{students.length}</h3>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 📋 Table */}
      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-3 text-left">Student Name</th>
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* 🔄 Loading */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                  </tr>
                ))}

              {/* 📭 Empty */}
              {!loading && selectedSubject && paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No students found
                  </td>
                </tr>
              )}

              {/* 📊 Data */}
              {!loading &&
                paginated.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-muted/40">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-muted-foreground">{s.id}</td>

                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => confirm("Remove student from subject?")}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 📄 Pagination */}
      {selectedSubject && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
