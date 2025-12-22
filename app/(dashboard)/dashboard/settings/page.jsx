import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { ShopSettings } from "@/components/settings/shop-settings"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { ReceiptSettings } from "@/components/settings/receipt-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, User, Receipt } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get shop for user
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  return (
    <div className="flex flex-col">
      <Header
        title="Settings"
        description="Manage your shop and account settings"
        userEmail={user?.email}
      />

      <div className="p-6">
        <Tabs defaultValue="shop" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="shop" className="gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>

            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>

            <TabsTrigger value="receipt" className="gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Receipt</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop">
            <ShopSettings shop={shop} userId={user?.id} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings user={user} />
          </TabsContent>

          <TabsContent value="receipt">
            <ReceiptSettings shop={shop} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
