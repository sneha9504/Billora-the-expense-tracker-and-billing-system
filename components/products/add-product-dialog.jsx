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
  DialogTrigger,
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

export function AddProductDialog({ shopId, categories, children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    brand: "",
    price: "",
    cost_price: "",
    gst_percentage: "5",
    stock: "",
    reorder_level: "10",
    unit: "pcs",
    description: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!shopId) {
      toast.error("Please set up your shop first in Settings")
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Generate SKU if not provided
    const sku =
      formData.sku || `SKU-${Date.now().toString(36).toUpperCase()}`

    const { error } = await supabase.from("products").insert({
      shop_id: shopId,
      name: formData.name,
      sku,
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
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Product added successfully!")
    setOpen(false)
    setFormData({
      name: "",
      sku: "",
      barcode: "",
      category: "",
      brand: "",
      price: "",
      cost_price: "",
      gst_percentage: "5",
      stock: "",
      reorder_level: "10",
      unit: "pcs",
      description: "",
    })
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory
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
                  placeholder="e.g. Rice 1kg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>SKU (auto-generated if empty)</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sku: e.target.value,
                    })
                  }
                  placeholder="e.g. RICE-001"
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
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                  placeholder="e.g. Fortune"
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
                  placeholder="0.00"
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
                  placeholder="0.00"
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
                  placeholder="0"
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
                  placeholder="10"
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
                placeholder="Scan or enter barcode"
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
                placeholder="Product description..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
