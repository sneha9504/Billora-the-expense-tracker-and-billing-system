"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ShopSettings from "@/components/settings/shop-settings"
import ReceiptSettings from "@/components/settings/receipt-settings"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    shopName: "",
    shopAddress: "",
    shopPhone: "",
    shopEmail: "",
    gstin: "",
    receiptHeader: "",
    receiptFooter: "Thank you for shopping with us!",
    showLogo: true,
    showGstin: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      if (data && Object.keys(data).length > 0) {
        setSettings({ ...settings, ...data })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your shop and receipt settings</p>
      </div>

      <Tabs defaultValue="shop" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="shop">Shop Details</TabsTrigger>
          <TabsTrigger value="receipt">Receipt</TabsTrigger>
        </TabsList>

        <TabsContent value="shop">
          <ShopSettings settings={settings} setSettings={setSettings} onSave={handleSave} saving={saving} />
        </TabsContent>

        <TabsContent value="receipt">
          <ReceiptSettings settings={settings} setSettings={setSettings} onSave={handleSave} saving={saving} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
