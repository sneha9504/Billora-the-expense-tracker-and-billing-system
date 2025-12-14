"use client"

import { useState } from "react"
import { Search, Plus, Minus, Trash2, X, CreditCard, Banknote, Smartphone, ShoppingCart, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"

const categories = ["All", "Groceries", "Dairy", "Beverages", "Snacks", "Personal Care", "Household"]

const quickAmounts = [10, 20, 50, 100, 200, 500, 1000, 2000]

export default function BillingPOS({
  products,
  cart,
  loading,
  customerName,
  customerPhone,
  paymentMode,
  discount,
  cashReceived,
  subtotal,
  discountAmount,
  total,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onPaymentModeChange,
  onDiscountChange,
  onCashReceivedChange,
  onCompleteSale,
}) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const change = paymentMode === "cash" ? (Number.parseFloat(cashReceived) || 0) - total : 0

  return (
    <div className="grid h-full gap-6 lg:grid-cols-5">
      {/* Products Panel */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Products</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {/* Categories */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-22rem)]">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-4">
                  {filteredProducts.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => onAddToCart(product)}
                      className="flex flex-col rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-accent/50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl font-bold text-primary mb-2">
                        {product.name?.charAt(0)}
                      </div>
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <p className="font-semibold text-primary">{formatCurrency(product.price)}</p>
                        <Badge variant="outline" className="text-xs">
                          {product.stock} left
                        </Badge>
                      </div>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full flex h-32 items-center justify-center text-muted-foreground">
                      No products found
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cart Panel */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </CardTitle>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClearCart}>
                  <X className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products to start billing</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <ScrollArea className="flex-1 -mx-2 px-2">
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="w-20 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => onRemoveFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Customer Name</Label>
                    <Input
                      placeholder="Walk-in"
                      value={customerName}
                      onChange={(e) => onCustomerNameChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Phone</Label>
                    <Input
                      placeholder="Optional"
                      value={customerPhone}
                      onChange={(e) => onCustomerPhoneChange(e.target.value)}
                    />
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="mb-4">
                  <Label className="text-xs mb-2 block">Payment Mode</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={paymentMode === "cash" ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => onPaymentModeChange("cash")}
                    >
                      <Banknote className="h-4 w-4" />
                      Cash
                    </Button>
                    <Button
                      variant={paymentMode === "card" ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => onPaymentModeChange("card")}
                    >
                      <CreditCard className="h-4 w-4" />
                      Card
                    </Button>
                    <Button
                      variant={paymentMode === "upi" ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => onPaymentModeChange("upi")}
                    >
                      <Smartphone className="h-4 w-4" />
                      UPI
                    </Button>
                  </div>
                </div>

                {/* Cash Calculator */}
                {paymentMode === "cash" && (
                  <div className="mb-4 space-y-2">
                    <Label className="text-xs">Cash Received</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={cashReceived}
                      onChange={(e) => onCashReceivedChange(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-1">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => onCashReceivedChange((Number.parseFloat(cashReceived) || 0) + amount)}
                        >
                          +{amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discount */}
                <div className="mb-4">
                  <Label className="text-xs flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Discount
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      placeholder="0"
                      value={discount || ""}
                      onChange={(e) => onDiscountChange(Number.parseFloat(e.target.value) || 0)}
                      className="w-20"
                      min="0"
                      max="100"
                    />
                    <span className="flex items-center text-muted-foreground">%</span>
                    {[5, 10, 15, 20].map((d) => (
                      <Button key={d} variant="outline" size="sm" onClick={() => onDiscountChange(d)}>
                        {d}%
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2 rounded-lg bg-muted p-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount ({discount}%)</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                  {paymentMode === "cash" && cashReceived && (
                    <div className="flex justify-between text-sm">
                      <span>Change</span>
                      <span className={change >= 0 ? "text-success" : "text-destructive"}>
                        {formatCurrency(change)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Complete Sale Button */}
                <Button
                  className="mt-4 h-12 text-lg"
                  onClick={onCompleteSale}
                  disabled={cart.length === 0 || (paymentMode === "cash" && change < 0)}
                >
                  Complete Sale - {formatCurrency(total)}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
