"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "@/components/ui/fluid-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createStaff, deleteStaff, updateStaff } from "@/services/admin.services";
import { IStaffUser, StaffRole } from "@/types/admin.types";
import { UserRole } from "@/types/auth.types";
import { ICustomerProfile } from "@/types/user.types";
import { Mail, Phone, Plus, Search, Trash2 } from "lucide-react";
import React, { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface StaffAndCrmClientProps {
  initialStaff: IStaffUser[];
  initialCustomers: ICustomerProfile[];
}

export default function StaffAndCrmClient({
  initialStaff,
  initialCustomers,
}: StaffAndCrmClientProps) {
  const [staffList, setStaffList] = useState<IStaffUser[]>(initialStaff);
  const [customerList] = useState<ICustomerProfile[]>(initialCustomers);
  const [activeTab, setActiveTab] = useState<"STAFF" | "CUSTOMERS">("STAFF");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffRole, setStaffRole] = useState<StaffRole>("MODERATOR");
  const [staffPassword, setStaffPassword] = useState("");

  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q)
      );
    });
  }, [staffList, searchTerm]);

  const filteredCustomers = useMemo(() => {
    return customerList.filter((c) => {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phoneNumber?.includes(q)
      );
    });
  }, [customerList, searchTerm]);

  const handleCreateStaff = () => {
    if (!staffName || !staffEmail || !staffPassword) {
      toast.error("Please fill in name, email and password");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createStaff({
          name: staffName,
          email: staffEmail,
          phoneNumber: staffPhone || undefined,
          role: staffRole,
          password: staffPassword,
        });

        if (res?.data) {
          setStaffList((prev) => [res.data, ...prev]);
        }
        toast.success(`Staff account created for ${staffName}`);
        setIsAddStaffOpen(false);
        setStaffName("");
        setStaffEmail("");
        setStaffPhone("");
        setStaffPassword("");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to create staff account");
      }
    });
  };

  const handleRoleChange = (staffId: string, newRole: StaffRole) => {
    startTransition(async () => {
      try {
        await updateStaff(staffId, { role: newRole });
        setStaffList((prev) =>
          prev.map((s) => (s.id === staffId ? { ...s, role: newRole as UserRole } : s))
        );
        toast.success("Role updated");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update role");
      }
    });
  };

  const handleDeleteStaff = (staffId: string, name: string) => {
    if (!confirm(`Revoke access for ${name}?`)) return;

    startTransition(async () => {
      try {
        await deleteStaff(staffId);
        setStaffList((prev) => prev.filter((s) => s.id !== staffId));
        toast.success(`Access revoked for ${name}`);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to delete staff member");
      }
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-1 space-y-0">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Atelier Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
              {staffList.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active operations members
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-1 space-y-0">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Registered Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
              {customerList.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Customer profiles
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-1 space-y-0">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal tracking-tight text-foreground">
              RBAC
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Role permissions active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "STAFF" | "CUSTOMERS")}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <TabsList className="h-9">
            <TabsTrigger value="STAFF" className="text-xs font-normal cursor-pointer">
              Atelier Staff ({staffList.length})
            </TabsTrigger>
            <TabsTrigger value="CUSTOMERS" className="text-xs font-normal cursor-pointer">
              Customer CRM ({customerList.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search staff or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs h-9 bg-background font-normal"
              />
            </div>

            {activeTab === "STAFF" && (
              <Button
                size="sm"
                onClick={() => setIsAddStaffOpen(true)}
                className="h-9 text-xs font-normal cursor-pointer gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Add Staff</span>
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "STAFF" ? (
            <motion.div
              key="staff-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="text-xs font-normal">Staff Member</TableHead>
                      <TableHead className="text-xs font-normal">Contact</TableHead>
                      <TableHead className="text-xs font-normal">Assigned Role</TableHead>
                      <TableHead className="text-xs font-normal">Status</TableHead>
                      <TableHead className="text-xs font-normal text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                          No staff members found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="font-normal text-xs text-foreground">
                                {staff.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono">
                                ID: {staff.id.substring(0, 8)}...
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="text-xs font-normal text-foreground flex items-center gap-1.5">
                                <Mail className="size-3 text-muted-foreground" />
                                <span>{staff.email}</span>
                              </div>
                              {staff.phoneNumber && (
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                  <Phone className="size-3" />
                                  <span>{staff.phoneNumber}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Select
                              value={staff.role}
                              onValueChange={(val) => val && handleRoleChange(staff.id, val as StaffRole)}
                              disabled={isPending}
                            >
                              <SelectTrigger className="w-36 h-7 text-xs font-normal">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SUPER_ADMIN" className="text-xs font-normal">Super Admin</SelectItem>
                                <SelectItem value="ADMIN" className="text-xs font-normal">Admin</SelectItem>
                                <SelectItem value="MANAGER" className="text-xs font-normal">Manager</SelectItem>
                                <SelectItem value="MODERATOR" className="text-xs font-normal">Call Moderator</SelectItem>
                                <SelectItem value="INVENTORY_STAFF" className="text-xs font-normal">Vault Staff</SelectItem>
                                <SelectItem value="ACCOUNTANT" className="text-xs font-normal">Accountant</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                              Active
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteStaff(staff.id, staff.name)}
                              className="size-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="customers-tab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="text-xs font-normal">Customer</TableHead>
                      <TableHead className="text-xs font-normal">Contact Info</TableHead>
                      <TableHead className="text-xs font-normal">Loyalty Points</TableHead>
                      <TableHead className="text-xs font-normal">Orders Count</TableHead>
                      <TableHead className="text-xs font-normal text-right">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                          No registered fragrance customers
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((c) => (
                        <TableRow key={c.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="font-normal text-xs text-foreground">{c.name}</div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="text-xs font-normal text-foreground">{c.email}</div>
                              <div className="text-[11px] text-muted-foreground">{c.phoneNumber || "No phone"}</div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="text-xs font-normal text-muted-foreground tabular-nums">
                              {c.loyaltyPoints || 0} pts
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className="text-xs font-normal text-foreground tabular-nums">
                              {(c as unknown as { _count?: { orders?: number } })?._count?.orders ?? 0}
                            </span>{" "}
                            <span className="text-[11px] text-muted-foreground">orders</span>
                          </TableCell>

                          <TableCell className="text-right text-[11px] text-muted-foreground">
                            Customer
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>

      {/* Add Staff Dialog */}
      <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-normal">
              Add Staff Member
            </DialogTitle>
            <DialogDescription className="text-xs font-normal">
              Assign role and initial credentials
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-normal">Full Name</Label>
              <Input
                placeholder="Full name"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Email Address</Label>
              <Input
                type="email"
                placeholder="name@fifthsenseperfumes.com"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Phone Number (Optional)</Label>
              <Input
                placeholder="01712345678"
                value={staffPhone}
                onChange={(e) => setStaffPhone(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Role Assignment</Label>
              <Select value={staffRole} onValueChange={(val) => val && setStaffRole(val as StaffRole)}>
                <SelectTrigger className="text-xs h-9 font-normal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN" className="text-xs font-normal">Administrator</SelectItem>
                  <SelectItem value="MANAGER" className="text-xs font-normal">Operations Manager</SelectItem>
                  <SelectItem value="MODERATOR" className="text-xs font-normal">Call Center Moderator</SelectItem>
                  <SelectItem value="INVENTORY_STAFF" className="text-xs font-normal">Vault / Inventory</SelectItem>
                  <SelectItem value="ACCOUNTANT" className="text-xs font-normal">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-normal">Initial Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                className="text-xs h-9 font-normal"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddStaffOpen(false)}
              disabled={isPending}
              className="text-xs font-normal"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateStaff}
              disabled={isPending}
              className="text-xs font-normal cursor-pointer"
            >
              {isPending ? "Creating..." : "Save Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
