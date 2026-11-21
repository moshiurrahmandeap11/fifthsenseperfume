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
  FolderTree,
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
  const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // Group into Root Categories and Children
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

  // Filter based on search term
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
    <div className="space-y-4">
      {/* Search and Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search categories or subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <Button
          onClick={handleCreateRoot}
          size="sm"
          className="gap-1.5 h-9 text-xs cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add Root Category</span>
        </Button>
      </div>

      {/* Category Tree Table Container */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Category Name & Hierarchy</TableHead>
              <TableHead>Slug Identifier</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="text-center">Store Visibility</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-xs text-muted-foreground"
                >
                  <FolderTree className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="font-medium text-foreground">
                    No categories found
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {searchTerm
                      ? "No categories match your search keyword."
                      : "Create top-level collections (e.g. Extrait, EDP, Discovery Sets) to structure your luxury fragrance atelier."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((root, index) => {
                const hasChildren =
                  root.children && root.children.length > 0;
                const isExpanded = !!expandedIds[root.id];
                const productCount = root._count?.products || 0;

                return (
                  <React.Fragment key={root.id}>
                    {/* Root Category Row */}
                    <TableRow className="hover:bg-muted/40 font-medium">
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          {hasChildren ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(root.id)}
                              className="size-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground cursor-pointer transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="size-4 text-primary" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </button>
                          ) : (
                            <div className="size-6" />
                          )}

                          {root.image ? (
                            <div className="relative size-8 rounded-md border overflow-hidden shrink-0 bg-muted">
                              <Image
                                src={root.image}
                                alt={root.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="size-8 rounded-md border bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground">
                              <ImageIcon className="size-4" />
                            </div>
                          )}

                          <div>
                            <div className="text-xs font-bold text-foreground flex items-center gap-2">
                              <span>{root.name}</span>
                              {root.nameBn && (
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  ({root.nameBn})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              Root Collection
                              {hasChildren &&
                                ` • ${root.children?.length} subcategories`}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-[11px] text-muted-foreground">
                        /{root.slug}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {productCount} {productCount === 1 ? "Item" : "Items"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center text-xs font-mono">
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
                            className="size-8 rounded-md hover:bg-muted inline-flex items-center justify-center text-muted-foreground cursor-pointer"
                            aria-label="Category Actions"
                          >
                            <MoreVertical className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 text-xs">
                            <DropdownMenuItem
                              onClick={() => handleAddSubcategory(root.id)}
                              className="cursor-pointer gap-2"
                            >
                              <Plus className="size-3.5 text-primary" />
                              <span>Add Subcategory</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(root)}
                              className="cursor-pointer gap-2"
                            >
                              <Edit2 className="size-3.5 text-muted-foreground" />
                              <span>Edit Category</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingCategory(root)}
                              className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {/* Subcategories (Visible when expanded) */}
                    {hasChildren &&
                      isExpanded &&
                      root.children?.map((child, cIdx) => {
                        const childProducts = child._count?.products || 0;

                        return (
                          <TableRow
                            key={child.id}
                            className="bg-muted/10 hover:bg-muted/20"
                          >
                            <TableCell className="text-center text-[10px] text-muted-foreground/60">
                              {index + 1}.{cIdx + 1}
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2.5 pl-8">
                                <span className="text-muted-foreground/60 text-xs">
                                  └
                                </span>

                                {child.image ? (
                                  <div className="relative size-7 rounded-md border overflow-hidden shrink-0 bg-muted">
                                    <Image
                                      src={child.image}
                                      alt={child.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="size-7 rounded-md border bg-muted/40 flex items-center justify-center shrink-0 text-muted-foreground">
                                    <ImageIcon className="size-3.5" />
                                  </div>
                                )}

                                <div>
                                  <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                                    <span>{child.name}</span>
                                    {child.nameBn && (
                                      <span className="text-[10px] text-muted-foreground font-normal">
                                        ({child.nameBn})
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">
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
                                className="text-[10px] h-4.5"
                              >
                                {childProducts}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center text-xs font-mono">
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
                                  className="size-8 rounded-md hover:bg-muted inline-flex items-center justify-center text-muted-foreground cursor-pointer"
                                  aria-label="Subcategory Actions"
                                >
                                  <MoreVertical className="size-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40 text-xs"
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(child)}
                                    className="cursor-pointer gap-2"
                                  >
                                    <Edit2 className="size-3.5 text-muted-foreground" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setDeletingCategory(child)}
                                    className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
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
