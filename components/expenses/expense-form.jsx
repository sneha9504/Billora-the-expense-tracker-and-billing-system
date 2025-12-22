"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"

const expenseCategories = [
  "Rent",
  "Electricity",
  "Staff Salary",
  "Inventory Purchase",
  "Transportation",
  "Marketing",
  "Maintenance",
  "Internet & Phone",
  "Insurance",
  "Taxes",
  "Supplies",
  "Other",
]

export function ExpenseForm({ shopId }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    vendor: "",
    payment_mode: "cash",
    description: "",
    date: new Date().toISOString().split("T")[0],
    is_recurring: false,
    recurring_frequency: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!shopId) {
      toast.error("Please set up your shop first in Settings")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("expenses").insert({
      shop_id: shopId,
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      vendor: formData.vendor || null,
      payment_mode: formData.payment_mode,
      description: formData.description || null,
      date: formData.date,
      is_recurring: formData.is_recurring,
      recurring_frequency: formData.is_recurring
        ? formData.recurring_frequency
        : null,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Expense added successfully!")
    setFormData({
      category: "",
      amount: "",
      vendor: "",
      payment_mode: "cash",
      description: "",
      date: new Date().toISOString().split("T")[0],
      is_recurring: false,
      recurring_frequency: "",
    })

    router.refresh()
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Expense
        </CardTitle>
        <CardDescription>
          Record a new business expense
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount (₹) *</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <Select
              value={formData.payment_mode}
              onValueChange={(value) =>
                setFormData({ ...formData, payment_mode: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">
                  Bank Transfer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vendor / Payee</Label>
            <Input
              value={formData.vendor}
              onChange={(e) =>
                setFormData({ ...formData, vendor: e.target.value })
              }
              placeholder="e.g. ABC Supplies"
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Additional details..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="font-medium">
                Recurring Expense
              </Label>
              <p className="text-xs text-muted-foreground">
                Mark if this repeats regularly
              </p>
            </div>
            <Switch
              checked={formData.is_recurring}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  is_recurring: checked,
                })
              }
            />
          </div>

          {formData.is_recurring && (
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={formData.recurring_frequency}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    recurring_frequency: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
