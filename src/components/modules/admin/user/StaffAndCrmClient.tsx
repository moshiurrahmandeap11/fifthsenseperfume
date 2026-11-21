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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createStaff, deleteStaff, updateStaff } from "@/services/admin.services";
import { IStaffUser, StaffRole } from "@/types/admin.types";
import { UserRole } from "@/types/auth.types";
import { ICustomerProfile } from "@/types/user.types";
import {
  Crown,
  KeyRound,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
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

  // Add Staff Modal
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
      toast.error("Please fill in name, email and temporary password");
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
        toast.success("Staff role updated");
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to update role");
      }
    });
  };

  const handleDeleteStaff = (staffId: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke staff access for ${name}?`)) return;

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
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Atelier Staff &amp; Team
            </CardTitle>
            <ShieldCheck className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {staffList.length} members
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active admin, moderator and inventory team
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fragrance VIP Customers
            </CardTitle>
            <Crown className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {customerList.length} profiles
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Registered perfume connoisseurs
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Access Control
            </CardTitle>
            <KeyRound className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600">
              Role-Based RBAC
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Strict granular permission enforcement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "STAFF" | "CUSTOMERS")}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <TabsList className="h-9">
            <TabsTrigger value="STAFF" className="text-xs cursor-pointer">
              Atelier Staff ({staffList.length})
            </TabsTrigger>
            <TabsTrigger value="CUSTOMERS" className="text-xs cursor-pointer">
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
                className="pl-8 text-xs h-9 bg-background"
              />
            </div>

            {activeTab === "STAFF" && (
              <Button
                size="sm"
                onClick={() => setIsAddStaffOpen(true)}
                className="h-9 text-xs cursor-pointer gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Add Staff</span>
              </Button>
            )}
          </div>
        </div>

        {/* Staff Tab */}
        <TabsContent value="STAFF" className="mt-0">
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Staff Member</TableHead>
                  <TableHead className="text-xs font-semibold">Contact</TableHead>
                  <TableHead className="text-xs font-semibold">Assigned Role</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-44 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                        <Users className="size-8 stroke-[1.5]" />
                        <p className="text-xs font-medium">No staff members found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-semibold text-xs text-foreground">
                            {staff.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            ID: {staff.id.substring(0, 8)}...
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="text-xs text-foreground flex items-center gap-1">
                            <Mail className="size-3 text-muted-foreground" />
                            <span>{staff.email}</span>
                          </div>
                          {staff.phoneNumber && (
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
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
                          <SelectTrigger className="w-36 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="MODERATOR">Call Moderator</SelectItem>
                            <SelectItem value="INVENTORY_STAFF">Vault Staff</SelectItem>
                            <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px] gap-1">
                          <UserCheck className="size-2.5" /> Active
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteStaff(staff.id, staff.name)}
                          className="size-7 p-0 cursor-pointer text-destructive hover:bg-destructive/10"
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
        </TabsContent>

        {/* Customer CRM Tab */}
        <TabsContent value="CUSTOMERS" className="mt-0">
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Customer</TableHead>
                  <TableHead className="text-xs font-semibold">Contact Info</TableHead>
                  <TableHead className="text-xs font-semibold">Loyalty Club</TableHead>
                  <TableHead className="text-xs font-semibold">Orders Count</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-44 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                        <Crown className="size-8 stroke-[1.5]" />
                        <p className="text-xs font-medium">No registered fragrance customers</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="font-semibold text-xs text-foreground">{c.name}</div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="text-xs text-foreground">{c.email}</div>
                          <div className="text-[11px] text-muted-foreground">{c.phoneNumber || "No phone"}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <Crown className="size-2.5 text-amber-500" />
                          <span>{c.loyaltyPoints || 0} pts</span>
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-xs">{(c as unknown as { _count?: { orders?: number } })?._count?.orders ?? 0}</span>{" "}
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
        </TabsContent>
      </Tabs>

      {/* Add Staff Dialog */}
      <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Plus className="size-4 text-primary" />
              Add Atelier Staff Member
            </DialogTitle>
            <DialogDescription className="text-xs">
              Grant dashboard administrative and operations privileges
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. Tanvir Ahmed"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Official Email Address <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                placeholder="e.g. tanvir@fifthsenseperfumes.com"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Phone Number</Label>
              <Input
                placeholder="e.g. 01712345678"
                value={staffPhone}
                onChange={(e) => setStaffPhone(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Role Assignment</Label>
              <Select value={staffRole} onValueChange={(val) => val && setStaffRole(val as StaffRole)}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="MANAGER">Operations Manager</SelectItem>
                  <SelectItem value="MODERATOR">Call Center Moderator</SelectItem>
                  <SelectItem value="INVENTORY_STAFF">Vault / Fragrance Inventory</SelectItem>
                  <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Initial Password <span className="text-destructive">*</span></Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddStaffOpen(false)}
              disabled={isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateStaff}
              disabled={isPending}
              className="text-xs cursor-pointer"
            >
              {isPending ? "Creating..." : "Save Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
