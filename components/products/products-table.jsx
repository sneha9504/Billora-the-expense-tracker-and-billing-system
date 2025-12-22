"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import { cn } from "@/lib/utils"

export function ProductsTable({ products, shopId, categories }) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)

  const itemsPerPage = 10

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter

    let matchesStock = true
    if (stockFilter === "in-stock")
      matchesStock = product.stock > product.reorder_level
    else if (stockFilter === "low-stock")
      matchesStock =
        product.stock <= product.reorder_level && product.stock > 0
    else if (stockFilter === "out-of-stock")
      matchesStock = product.stock === 0

    return matchesSearch && matchesCategory && matchesStock
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Unique categories
  const productCategories = [...new Set(products.map((p) => p.category))]

  const getStockStatus = (stock, reorderLevel) => {
    if (stock === 0)
      return { label: "Out of Stock", variant: "destructive" }
    if (stock <= reorderLevel)
      return { label: "Low Stock", variant: "outline" }
    return { label: "In Stock", variant: "default" }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {productCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={stockFilter}
            onValueChange={(value) => {
              setStockFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Sr.
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                SKU
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Price
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Value
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {products.length === 0
                    ? "No products yet. Add your first product!"
                    : "No products match your filters"}
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product, index) => {
                const status = getStockStatus(
                  product.stock,
                  product.reorder_level
                )

                return (
                  <tr
                    key={product.id}
                    className={cn(
                      "border-b border-border hover:bg-muted/50 transition-colors",
                      index % 2 === 0 && "bg-muted/20"
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-medium text-xs">
                          {product.image ? (
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            product.name
                              .substring(0, 2)
                              .toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="text-xs text-muted-foreground">
                              {product.brand}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                      {product.sku || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="secondary">
                        {product.category}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-right text-sm">
                      <span
                        className={cn(
                          "font-medium",
                          product.stock === 0 &&
                            "text-destructive",
                          product.stock <=
                            product.reorder_level &&
                            product.stock > 0 &&
                            "text-warning"
                        )}
                      >
                        {product.stock}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        {product.unit}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right text-sm font-medium">
                      ₹{product.price.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right text-sm font-medium">
                      ₹
                      {(product.price * product.stock).toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setEditProduct(product)
                            }
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteProduct(product)
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(
              currentPage * itemsPerPage,
              filteredProducts.length
            )}{" "}
            of {filteredProducts.length} products
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {editProduct && (
        <EditProductDialog
          product={editProduct}
          shopId={shopId}
          categories={categories}
          open={!!editProduct}
          onOpenChange={(open) =>
            !open && setEditProduct(null)
          }
        />
      )}

      {deleteProduct && (
        <DeleteProductDialog
          product={deleteProduct}
          open={!!deleteProduct}
          onOpenChange={(open) =>
            !open && setDeleteProduct(null)
          }
        />
      )}
    </div>
  )
}
