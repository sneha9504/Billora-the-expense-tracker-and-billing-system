"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Receipt, Save } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

export function ReceiptSettings({ shop }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    receipt_header: "",
    receipt_footer: "",
  })

  useEffect(() => {
    if (shop) {
      setFormData({
        receipt_header: shop.receipt_header || "",
        receipt_footer: shop.receipt_footer || "",
      })
    }
  }, [shop])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!shop?.id) {
      toast.error("Please set up your shop first")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("shops")
      .update({
        receipt_header: formData.receipt_header || null,
        receipt_footer: formData.receipt_footer || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", shop.id)

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Receipt settings updated!")
    router.refresh()
    setLoading(false)
  }

  if (!shop) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please set up your shop first in the Shop tab
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Receipt Customization
        </CardTitle>
        <CardDescription>
          Customize your printed receipts and invoices
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Receipt Header Message</Label>
            <Textarea
              value={formData.receipt_header}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  receipt_header: e.target.value,
                })
              }
              placeholder="e.g. Track, Save, Grow Together"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              This message appears at the top of your receipts
            </p>
          </div>

          <div className="space-y-2">
            <Label>Receipt Footer Message</Label>
            <Textarea
              value={formData.receipt_footer}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  receipt_footer: e.target.value,
                })
              }
              placeholder="e.g. Thank You! Visit Again"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              This message appears at the bottom of your receipts
            </p>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-medium mb-3">
              Receipt Preview
            </p>

            <div className="bg-background rounded-lg p-4 font-mono text-xs border border-border max-w-xs mx-auto">
              <div className="text-center border-b border-dashed border-border pb-2 mb-2">
                <p className="font-bold">
                  {shop.name.toUpperCase()}
                </p>
                {formData.receipt_header && (
                  <p className="text-muted-foreground">
                    {formData.receipt_header}
                  </p>
                )}
              </div>

              <div className="border-b border-dashed border-border pb-2 mb-2 text-muted-foreground">
                <p>Invoice: INV-2025-XXXX</p>
                <p>Date: 07/12/2025</p>
              </div>

              <div className="border-b border-dashed border-border pb-2 mb-2">
                <div className="flex justify-between">
                  <span>Sample Item</span>
                  <span>₹100.00</span>
                </div>
              </div>

              <div className="border-b border-dashed border-border pb-2 mb-2">
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>₹100.00</span>
                </div>
              </div>

              <div className="text-center text-muted-foreground">
                {formData.receipt_footer ||
                  "Thank You! Visit Again"}
              </div>
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
            Save Receipt Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
