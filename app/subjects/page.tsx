"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

import { BASE_URL } from "@/lib/api";

type Subject = {
  subject_id: number;
  name: string;
  subject_code?: string;
  section?: string;
  teacher_id?: number;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selected, setSelected] = useState<Subject | null>(null);

  const [form, setForm] = useState({
    name: "",
    subject_code: "",
    section: "",
    teacher_id: "",
  });

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 6;

  // 🔥 Fetch
  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/subjects`);
      const json = await res.json();
      setSubjects(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Create
  const handleAdd = async () => {
    await fetch(`${BASE_URL}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpenAdd(false);
    setForm({
      name: "",
      subject_code: "",
      section: "",
      teacher_id: "",
    });

    fetchData();
  };

  const handleEdit = async () => {
    if (!selected) return;

    await fetch(`${BASE_URL}/subjects/${selected.subject_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpenEdit(false);
    setSelected(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!selected) return;

    await fetch(`${BASE_URL}/subjects/${selected.subject_id}`, {
      method: "DELETE",
    });

    setOpenDelete(false);
    setSelected(null);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 Filter
  const filtered = useMemo(() => {
    return subjects.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [subjects, search]);

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Subjects</h2>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search subjects..."
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
            <p className="text-sm text-muted-foreground">Total Subjects</p>
            <h3 className="text-xl font-bold">{subjects.length}</h3>
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
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Section</th>
                <th className="p-3 text-left">Teacher</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* 🔄 Loading */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-3">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))}

              {/* 📭 Empty */}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No subjects found
                  </td>
                </tr>
              )}

              {/* 📊 Data */}
              {!loading &&
                paginated.map((s) => (
                  <tr key={s.subject_id} className="border-t hover:bg-muted/40">
                    <td className="p-3 font-medium">{s.subject_id}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.subject_code || "-"}</td>
                    <td className="p-3">{s.section || "-"}</td>
                    <td className="p-3">{s.teacher_id || "-"}</td>

                    <td className="p-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelected(s);
                          setForm({
                            name: s.name,
                            subject_code: s.subject_code || "",
                            section: s.section || "",
                            teacher_id: String(s.teacher_id || ""),
                          });
                          setOpenEdit(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelected(s);
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

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Subject Code"
              onChange={(e) =>
                setForm({ ...form, subject_code: e.target.value })
              }
            />
            <Input
              placeholder="Section"
              onChange={(e) => setForm({ ...form, section: e.target.value })}
            />
            <Input
              placeholder="Teacher ID"
              onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleAdd}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              value={form.subject_code}
              onChange={(e) =>
                setForm({ ...form, subject_code: e.target.value })
              }
            />
            <Input
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
            />
            <Input
              value={form.teacher_id}
              onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleEdit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subject?</AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              This cannot be undone.
            </p>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
