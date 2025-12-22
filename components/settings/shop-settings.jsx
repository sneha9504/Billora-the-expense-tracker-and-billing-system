"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Store, Save } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

export function ShopSettings({ shop, userId }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gst_number: "",
    phone: "",
    email: "",
    tax_rate: "5",
    currency: "INR",
  })

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || "",
        address: shop.address || "",
        gst_number: shop.gst_number || "",
        phone: shop.phone || "",
        email: shop.email || "",
        tax_rate: shop.tax_rate?.toString() || "5",
        currency: shop.currency || "INR",
      })
    }
  }, [shop])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userId) {
      toast.error("User not authenticated")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const shopData = {
      user_id: userId,
      name: formData.name,
      address: formData.address || null,
      gst_number: formData.gst_number || null,
      phone: formData.phone || null,
      email: formData.email || null,
      tax_rate: Number.parseFloat(formData.tax_rate),
      currency: formData.currency,
      updated_at: new Date().toISOString(),
    }

    if (shop?.id) {
      // Update existing shop
      const { error } = await supabase
        .from("shops")
        .update(shopData)
        .eq("id", shop.id)

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }
    } else {
      // Create new shop
      const { error } = await supabase
        .from("shops")
        .insert(shopData)

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }
    }

    toast.success(
      shop?.id
        ? "Shop settings updated!"
        : "Shop created successfully!"
    )
    router.refresh()
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Shop Details
        </CardTitle>
        <CardDescription>
          {shop
            ? "Update your shop information"
            : "Set up your shop to start using Billora"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Shop Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="Your Shop Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="shop@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: e.target.value,
                })
              }
              placeholder="Shop address..."
              rows={2}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input
                value={formData.gst_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gst_number: e.target.value,
                  })
                }
                placeholder="22AAAAA0000A1Z5"
              />
            </div>

            <div className="space-y-2">
              <Label>Default Tax Rate (%)</Label>
              <Select
                value={formData.tax_rate}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    tax_rate: value,
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

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    currency: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {shop?.id ? "Save Changes" : "Create Shop"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
