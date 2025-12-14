"use client"

import { useState, useEffect } from "react"
import BillingPOS from "@/components/billing/billing-pos"
import BillPreview from "@/components/billing/bill-preview"

export default function BillingPage() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentMode, setPaymentMode] = useState("cash")
  const [discount, setDiscount] = useState(0)
  const [cashReceived, setCashReceived] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [completedBill, setCompletedBill] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data.filter((p) => p.stock > 0))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.productId === product._id)
    if (existing) {
      if (existing.quantity < product.stock) {
        setCart(cart.map((item) => (item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          maxStock: product.stock,
        },
      ])
    }
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.productId !== productId))
    } else {
      setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
    }
  }

  function removeFromCart(productId) {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  function clearCart() {
    setCart([])
    setCustomerName("")
    setCustomerPhone("")
    setDiscount(0)
    setCashReceived("")
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  async function completeSale() {
    const billNumber = `BIL${Date.now().toString(36).toUpperCase()}`

    const transaction = {
      billNumber,
      customerName: customerName || "Walk-in Customer",
      customerPhone,
      items: cart,
      subtotal,
      discount,
      discountAmount,
      total,
      paymentMode,
      cashReceived: paymentMode === "cash" ? Number.parseFloat(cashReceived) || total : total,
      change: paymentMode === "cash" ? (Number.parseFloat(cashReceived) || total) - total : 0,
      status: "completed",
    }

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })

      if (res.ok) {
        setCompletedBill(transaction)
        setShowPreview(true)
        clearCart()
        fetchProducts()
      }
    } catch (error) {
      console.error("Error completing sale:", error)
    }
  }

  return (
    <div className="h-[calc(100vh-7rem)]">
      <BillingPOS
        products={products}
        cart={cart}
        loading={loading}
        customerName={customerName}
        customerPhone={customerPhone}
        paymentMode={paymentMode}
        discount={discount}
        cashReceived={cashReceived}
        subtotal={subtotal}
        discountAmount={discountAmount}
        total={total}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        onCustomerNameChange={setCustomerName}
        onCustomerPhoneChange={setCustomerPhone}
        onPaymentModeChange={setPaymentMode}
        onDiscountChange={setDiscount}
        onCashReceivedChange={setCashReceived}
        onCompleteSale={completeSale}
      />

      <BillPreview bill={completedBill} open={showPreview} onOpenChange={setShowPreview} />
    </div>
  )
}
