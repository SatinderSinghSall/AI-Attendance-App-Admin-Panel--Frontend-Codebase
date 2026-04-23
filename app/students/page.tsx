"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { BASE_URL, fetchStudents } from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Student = {
  id?: string;
  student_id?: string;
  _id?: string;
  name: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [form, setForm] = useState({
    name: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchStudents();
        setStudents(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return students.filter((s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const reloadStudents = async () => {
    const list = await fetchStudents();
    setStudents(list);
  };

  const handleAdd = async () => {
    try {
      if (!form.name) {
        toast.error("Name is required");
        return;
      }

      setLoadingAdd(true);

      const res = await fetch(`${BASE_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Student created 🎉");

      setOpenAdd(false);
      setForm({ name: "" });

      await reloadStudents();
    } catch {
      toast.error("Failed to create student ❌");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedStudent) return;

    const id =
      selectedStudent.student_id || selectedStudent.id || selectedStudent._id;

    try {
      setLoadingEdit(true);

      const res = await fetch(`${BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Student updated ✏️");

      setOpenEdit(false);
      setSelectedStudent(null);

      await reloadStudents();
    } catch {
      toast.error("Failed to update student ❌");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    const id =
      selectedStudent.student_id || selectedStudent.id || selectedStudent._id;

    try {
      setLoadingDelete(true);

      const res = await fetch(`${BASE_URL}/students/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Student deleted 🗑️");

      setOpenDelete(false);
      setSelectedStudent(null);

      await reloadStudents();
    } catch {
      toast.error("Failed to delete student ❌");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Students</h2>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Button onClick={() => setOpenAdd(true)}>+ Add</Button>
        </div>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Students</p>
            <h3 className="text-xl font-bold">{students.length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* 📋 Table */}
      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* 🔄 Loading */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                  </tr>
                ))}

              {/* 📭 Empty */}
              {!loading && paginated.length === 0 && (
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
                paginated.map((s, i) => (
                  <tr key={i} className="border-t hover:bg-muted/40 transition">
                    <td className="p-4 font-medium">{s.name}</td>

                    <td className="p-4 text-muted-foreground">
                      {s.id || s.student_id || s._id || "—"}
                    </td>

                    <td className="p-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStudent(s);
                          setForm({ name: s.name });
                          setOpenEdit(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedStudent(s);
                          setOpenDelete(true);
                        }}
                      >
                        Delete
                      </Button>
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
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Create a new student entry.
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Student Name</label>
              <Input
                placeholder="e.g. Satinder Singh"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>

            <Button onClick={handleAdd} disabled={loadingAdd}>
              {loadingAdd ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Student Name</label>
              <Input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleEdit} disabled={loadingEdit}>
              {loadingEdit ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this student?</AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loadingDelete}>
              {loadingDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
