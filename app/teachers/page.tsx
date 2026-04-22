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

import { BASE_URL } from "@/lib/api";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Teacher = {
  teacher_id: number;
  username: string;
  name: string;
  password?: string;
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // 🔥 Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/teachers`);
      const json = await res.json();
      setTeachers(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    await fetch(`${BASE_URL}/teachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpenAdd(false);
    setForm({ username: "", name: "", password: "" });
    fetchTeachers();
  };

  const handleEdit = async () => {
    if (!selectedTeacher) return;

    await fetch(`${BASE_URL}/teachers/${selectedTeacher.teacher_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpenEdit(false);
    setSelectedTeacher(null);
    fetchTeachers();
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;

    await fetch(`${BASE_URL}/teachers/${selectedTeacher.teacher_id}`, {
      method: "DELETE",
    });

    setOpenDelete(false);
    setSelectedTeacher(null);
    fetchTeachers();
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // 🔍 Filter
  const filtered = useMemo(() => {
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.username.toLowerCase().includes(search.toLowerCase()),
    );
  }, [teachers, search]);

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Teachers</h2>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search teachers..."
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
            <p className="text-sm text-muted-foreground">Total Teachers</p>
            <h3 className="text-xl font-bold">{teachers.length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* 📋 Table */}
      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Password</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* 🔄 Loading */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))}

              {/* 📭 Empty */}
              {!loading && paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No teachers found
                  </td>
                </tr>
              )}

              {/* 📊 Data */}
              {!loading &&
                paginated.map((t) => (
                  <tr key={t.teacher_id} className="border-t hover:bg-muted/40">
                    <td className="p-4 font-medium">{t.teacher_id}</td>
                    <td className="p-4">{t.name}</td>
                    <td className="p-4 text-muted-foreground">@{t.username}</td>
                    <td className="p-4 text-muted-foreground">
                      {t.password || "******"}
                    </td>

                    <td className="p-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTeacher(t);
                          setForm({
                            username: t.username,
                            name: t.name,
                            password: "",
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
                          setSelectedTeacher(t);
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
            <DialogTitle>Add Teacher</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              type="password"
              placeholder="New Password (optional)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            <AlertDialogTitle>Delete this teacher?</AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
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
