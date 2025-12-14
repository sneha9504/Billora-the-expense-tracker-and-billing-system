"use client"

import { Store, Phone, Mail, MapPin, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ShopSettings({ settings, setSettings, onSave, saving }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Shop Details
        </CardTitle>
        <CardDescription>Configure your shop information that appears on receipts and invoices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="shopName" className="flex items-center gap-2">
              <Store className="h-4 w-4 text-muted-foreground" />
              Shop Name
            </Label>
            <Input
              id="shopName"
              placeholder="Enter shop name"
              value={settings.shopName}
              onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopPhone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="shopPhone"
              placeholder="+91 98765 43210"
              value={settings.shopPhone}
              onChange={(e) => setSettings({ ...settings, shopPhone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="shopEmail"
              type="email"
              placeholder="shop@example.com"
              value={settings.shopEmail}
              onChange={(e) => setSettings({ ...settings, shopEmail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              GSTIN
            </Label>
            <Input
              id="gstin"
              placeholder="29AABCU9603R1ZM"
              value={settings.gstin}
              onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopAddress" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Shop Address
          </Label>
          <Textarea
            id="shopAddress"
            placeholder="Enter complete address"
            value={settings.shopAddress}
            onChange={(e) => setSettings({ ...settings, shopAddress: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
