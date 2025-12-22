import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { ProductsTable } from "@/components/products/products-table"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"

export default async function ProductsPage() {
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
  let categories = []

  if (shop?.id) {
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("shop_id", shop.id)
      .order("created_at", { ascending: false })

    if (productsData) {
      products = productsData
    }

    const { data: categoriesData } = await supabase
      .from("categories")
      .select("id, name")
      .eq("shop_id", shop.id)

    if (categoriesData) {
      categories = categoriesData
    }
  }

  // Calculate inventory stats
  const totalProducts = products.length
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.stock),
    0
  )
  const lowStockCount = products.filter(
    (p) => p.stock <= p.reorder_level && p.stock > 0
  ).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  return (
    <div className="flex flex-col">
      <Header
        title="Products"
        description="Manage your product inventory"
        userEmail={user?.email}
      />

      <div className="space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <span className="text-lg font-bold">₹</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Inventory Value
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  ₹{totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <span className="text-lg font-bold">!</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {lowStockCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <span className="text-lg font-bold">0</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {outOfStockCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Product Inventory
            </h2>
            <AddProductDialog shopId={shop?.id} categories={categories}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </AddProductDialog>
          </div>

          <ProductsTable
            products={products}
            shopId={shop?.id}
            categories={categories}
          />
        </div>
      </div>
    </div>
  )
}
