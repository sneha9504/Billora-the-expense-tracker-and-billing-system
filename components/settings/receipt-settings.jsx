"use client"

import { Receipt } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function ReceiptSettings({ settings, setSettings, onSave, saving }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Receipt Configuration
          </CardTitle>
          <CardDescription>Customize how your receipts look when printed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="receiptHeader">Receipt Header</Label>
            <Input
              id="receiptHeader"
              placeholder="Custom header text"
              value={settings.receiptHeader}
              onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiptFooter">Receipt Footer</Label>
            <Textarea
              id="receiptFooter"
              placeholder="Thank you message"
              value={settings.receiptFooter}
              onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="showLogo" className="font-medium">
                  Show Logo
                </Label>
                <p className="text-xs text-muted-foreground">Display shop logo on receipts</p>
              </div>
              <Switch
                id="showLogo"
                checked={settings.showLogo}
                onCheckedChange={(checked) => setSettings({ ...settings, showLogo: checked })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="showGstin" className="font-medium">
                  Show GSTIN
                </Label>
                <p className="text-xs text-muted-foreground">Display GSTIN number on receipts</p>
              </div>
              <Switch
                id="showGstin"
                checked={settings.showGstin}
                onCheckedChange={(checked) => setSettings({ ...settings, showGstin: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Preview</CardTitle>
          <CardDescription>Preview how your receipt will look</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-white p-4 font-mono text-xs text-black">
            <div className="text-center">
              {settings.showLogo && <div className="mx-auto mb-2 h-10 w-10 rounded bg-gray-200" />}
              <h2 className="text-lg font-bold">{settings.shopName || "SHOP NAME"}</h2>
              {settings.receiptHeader && <p className="text-[10px]">{settings.receiptHeader}</p>}
              <p className="text-[10px]">{settings.shopAddress || "Shop Address"}</p>
              <p className="text-[10px]">Phone: {settings.shopPhone || "+91 00000 00000"}</p>
              {settings.showGstin && settings.gstin && <p className="text-[10px]">GSTIN: {settings.gstin}</p>}
            </div>

            <div className="my-2 border-t border-dashed border-gray-400" />

            <div className="flex justify-between text-[10px]">
              <span>Bill No: BILXXXXXX</span>
              <span>Date: {new Date().toLocaleDateString("en-IN")}</span>
            </div>

            <div className="my-2 border-t border-dashed border-gray-400" />

            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Sample Product x2</span>
                <span>Rs.200.00</span>
              </div>
              <div className="flex justify-between">
                <span>Another Item x1</span>
                <span>Rs.150.00</span>
              </div>
            </div>

            <div className="my-2 border-t border-dashed border-gray-400" />

            <div className="flex justify-between font-bold text-sm">
              <span>TOTAL:</span>
              <span>Rs.350.00</span>
            </div>

            <div className="my-2 border-t border-dashed border-gray-400" />

            <div className="text-center text-[10px]">
              <p>{settings.receiptFooter || "Thank you for shopping!"}</p>
              <p className="mt-1">*** Powered by Billora ***</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
