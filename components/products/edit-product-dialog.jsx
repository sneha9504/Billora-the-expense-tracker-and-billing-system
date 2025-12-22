"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

const defaultCategories = [
  "Grocery",
  "Beverages",
  "Snacks",
  "Dairy",
  "Personal Care",
  "Household",
  "Electronics",
  "Other",
]

export function EditProductDialog({
  product,
  shopId,
  categories,
  open,
  onOpenChange,
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku || "",
    barcode: product.barcode || "",
    category: product.category,
    brand: product.brand || "",
    price: product.price.toString(),
    cost_price: product.cost_price.toString(),
    gst_percentage: product.gst_percentage.toString(),
    stock: product.stock.toString(),
    reorder_level: product.reorder_level.toString(),
    unit: product.unit,
    description: product.description || "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("products")
      .update({
        name: formData.name,
        sku: formData.sku || null,
        barcode: formData.barcode || null,
        category: formData.category,
        brand: formData.brand || null,
        price: Number.parseFloat(formData.price),
        cost_price: formData.cost_price
          ? Number.parseFloat(formData.cost_price)
          : 0,
        gst_percentage: Number.parseFloat(formData.gst_percentage),
        stock: Number.parseInt(formData.stock),
        reorder_level: Number.parseInt(formData.reorder_level),
        unit: formData.unit,
        description: formData.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id)

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Product updated successfully!")
    onOpenChange(false)
    router.refresh()
    setLoading(false)
  }

  const allCategories = [
    ...new Set([
      ...defaultCategories,
      ...(categories || []).map((c) => c.name),
    ]),
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sku: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Brand</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brand: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Selling Price (₹) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Cost Price (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cost_price: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>GST %</Label>
                <Select
                  value={formData.gst_percentage}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      gst_percentage: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stock Quantity *</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Reorder Level</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.reorder_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reorder_level: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      unit: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">Pieces</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="g">Grams</SelectItem>
                    <SelectItem value="ltr">Liters</SelectItem>
                    <SelectItem value="ml">Milliliters</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Barcode</Label>
              <Input
                value={formData.barcode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    barcode: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
