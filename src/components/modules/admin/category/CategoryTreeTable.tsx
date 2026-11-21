"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICategory } from "@/types/category.types";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Image as ImageIcon,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import CategoryDeleteAlert from "./CategoryDeleteAlert";
import CategoryFormDialog from "./CategoryFormDialog";
import CategoryStatusToggle from "./CategoryStatusToggle";

interface CategoryTreeTableProps {
  categories: ICategory[];
  onRefresh: () => void;
}

export default function CategoryTreeTable({
  categories = [],
  onRefresh,
}: CategoryTreeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const { rootCategories, parentOptions } = useMemo(() => {
    const roots: ICategory[] = [];
    const parents: ICategory[] = [];

    categories.forEach((cat) => {
      parents.push(cat);
      if (!cat.parentId) {
        roots.push(cat);
      }
    });

    return { rootCategories: roots, parentOptions: parents };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return rootCategories;

    const query = searchTerm.toLowerCase();
    return rootCategories.filter(
      (root) =>
        root.name.toLowerCase().includes(query) ||
        (root.slug && root.slug.toLowerCase().includes(query)) ||
        (root.children &&
          root.children.some(
            (child) =>
              child.name.toLowerCase().includes(query) ||
              (child.slug && child.slug.toLowerCase().includes(query))
          ))
    );
  }, [rootCategories, searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreateRoot = () => {
    setEditingCategory(null);
    setSelectedParentId(null);
    setIsFormOpen(true);
  };

  const handleAddSubcategory = (parentId: string) => {
    setEditingCategory(null);
    setSelectedParentId(parentId);
    setIsFormOpen(true);
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setSelectedParentId(category.parentId || null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search and Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs font-normal"
          />
        </div>

        <Button
          onClick={handleCreateRoot}
          size="sm"
          className="gap-1.5 h-9 text-xs font-normal cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add Collection</span>
        </Button>
      </div>

      {/* Category Tree Table Container */}
      <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-10 text-center text-xs font-normal">#</TableHead>
              <TableHead className="text-xs font-normal">Collection &amp; Hierarchy</TableHead>
              <TableHead className="text-xs font-normal">Slug</TableHead>
              <TableHead className="text-center text-xs font-normal">Products</TableHead>
              <TableHead className="text-center text-xs font-normal">Order</TableHead>
              <TableHead className="text-center text-xs font-normal">Status</TableHead>
              <TableHead className="w-16 text-right text-xs font-normal">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-xs text-muted-foreground font-normal"
                >
                  No collections found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((root, index) => {
                const hasChildren = root.children && root.children.length > 0;
                const isExpanded = !!expandedIds[root.id];
                const productCount = root._count?.products || 0;

                return (
                  <React.Fragment key={root.id}>
                    {/* Root Category Row */}
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          {hasChildren ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(root.id)}
                              className="size-6 rounded hover:bg-muted flex items-center justify-center text-muted-foreground cursor-pointer transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="size-3.5" />
                              ) : (
                                <ChevronRight className="size-3.5" />
                              )}
                            </button>
                          ) : (
                            <div className="size-6" />
                          )}

                          {root.image ? (
                            <div className="relative size-8 rounded border overflow-hidden shrink-0 bg-muted">
                              <Image
                                src={root.image}
                                alt={root.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="size-8 rounded border bg-muted/40 flex items-center justify-center shrink-0 text-muted-foreground">
                              <ImageIcon className="size-3.5" />
                            </div>
                          )}

                          <div>
                            <div className="text-xs font-normal text-foreground flex items-center gap-1.5">
                              <span>{root.name}</span>
                              {root.nameBn && (
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  ({root.nameBn})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-normal">
                              Root Collection
                              {hasChildren && ` · ${root.children?.length} subcategories`}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        /{root.slug}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                          {productCount}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center text-xs font-mono text-muted-foreground tabular-nums">
                        {root.sortOrder}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <CategoryStatusToggle
                            category={root}
                            onToggle={onRefresh}
                          />
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="size-7 rounded hover:bg-muted inline-flex items-center justify-center text-muted-foreground cursor-pointer"
                            aria-label="Actions"
                          >
                            <MoreVertical className="size-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 text-xs">
                            <DropdownMenuItem
                              onClick={() => handleAddSubcategory(root.id)}
                              className="cursor-pointer gap-2 font-normal"
                            >
                              <Plus className="size-3.5" />
                              <span>Add Subcategory</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(root)}
                              className="cursor-pointer gap-2 font-normal"
                            >
                              <Edit2 className="size-3.5" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingCategory(root)}
                              className="cursor-pointer gap-2 text-destructive focus:text-destructive font-normal"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {/* Subcategories */}
                    {hasChildren &&
                      isExpanded &&
                      root.children?.map((child, cIdx) => {
                        const childProducts = child._count?.products || 0;

                        return (
                          <TableRow
                            key={child.id}
                            className="bg-muted/10 hover:bg-muted/20"
                          >
                            <TableCell className="text-center text-[10px] text-muted-foreground/60 tabular-nums">
                              {index + 1}.{cIdx + 1}
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2 pl-7">
                                <span className="text-muted-foreground/50 text-xs">└</span>

                                {child.image ? (
                                  <div className="relative size-7 rounded border overflow-hidden shrink-0 bg-muted">
                                    <Image
                                      src={child.image}
                                      alt={child.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="size-7 rounded border bg-muted/40 flex items-center justify-center shrink-0 text-muted-foreground">
                                    <ImageIcon className="size-3" />
                                  </div>
                                )}

                                <div>
                                  <div className="text-xs font-normal text-foreground flex items-center gap-1.5">
                                    <span>{child.name}</span>
                                    {child.nameBn && (
                                      <span className="text-[10px] text-muted-foreground font-normal">
                                        ({child.nameBn})
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground font-normal">
                                    Subcategory of {root.name}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="font-mono text-[11px] text-muted-foreground">
                              /{child.slug}
                            </TableCell>

                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-normal text-muted-foreground"
                              >
                                {childProducts}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center text-xs font-mono text-muted-foreground tabular-nums">
                              {child.sortOrder}
                            </TableCell>

                            <TableCell className="text-center">
                              <div className="flex justify-center">
                                <CategoryStatusToggle
                                  category={child}
                                  onToggle={onRefresh}
                                />
                              </div>
                            </TableCell>

                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  className="size-7 rounded hover:bg-muted inline-flex items-center justify-center text-muted-foreground cursor-pointer"
                                  aria-label="Actions"
                                >
                                  <MoreVertical className="size-3.5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36 text-xs">
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(child)}
                                    className="cursor-pointer gap-2 font-normal"
                                  >
                                    <Edit2 className="size-3.5" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setDeletingCategory(child)}
                                    className="cursor-pointer gap-2 text-destructive focus:text-destructive font-normal"
                                  >
                                    <Trash2 className="size-3.5" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Category Create/Edit Modal */}
      <CategoryFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={onRefresh}
        initialData={editingCategory}
        parentCategories={parentOptions}
        defaultParentId={selectedParentId}
      />

      {/* Delete Confirmation Alert */}
      <CategoryDeleteAlert
        category={deletingCategory}
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
