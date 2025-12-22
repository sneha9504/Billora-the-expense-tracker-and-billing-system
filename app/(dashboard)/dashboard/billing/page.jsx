import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { BillingPOS } from "@/components/billing/billing-pos"

export default async function BillingPage() {
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

  let products = []

  if (shop?.id) {
    const { data: productsData } = await supabase
      .from("products")
      .select(
        "id, name, sku, barcode, category, brand, price, gst_percentage, stock, unit, image"
      )
      .eq("shop_id", shop.id)
      .eq("is_active", true)
      .gt("stock", 0)
      .order("name")

    if (productsData) {
      products = productsData
    }
  }

  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="flex h-screen flex-col">
      <Header
        title="Billing"
        description="Process sales and generate invoices"
        userEmail={user?.email}
      />
      <div className="flex-1 overflow-hidden">
        <BillingPOS
          products={products}
          categories={categories}
          shop={shop}
        />
      </div>
    </div>
  )
}
