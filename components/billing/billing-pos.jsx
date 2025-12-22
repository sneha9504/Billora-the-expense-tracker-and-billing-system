"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Banknote,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { BillPreview } from "./bill-preview"

export function BillingPOS({ products, categories, shop }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentMode, setPaymentMode] = useState("cash")
  const [receivedAmount, setReceivedAmount] = useState("")
  const [discount, setDiscount] = useState("")
  const [loading, setLoading] = useState(false)
  const [showBill, setShowBill] = useState(false)
  const [lastTransaction, setLastTransaction] = useState(null)

  const searchRef = useRef(null)
  const router = useRouter()

  /* -------------------- FILTER PRODUCTS -------------------- */
  const filteredProducts = products.filter((product) => {
    const q = search.toLowerCase()
    const matchesSearch =
      product.name.toLowerCase().includes(q) ||
      product.sku?.toLowerCase().includes(q) ||
      product.barcode?.toLowerCase().includes(q)

    const matchesCategory =
      !selectedCategory || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  /* -------------------- CALCULATIONS -------------------- */
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const gstAmount = cart.reduce(
    (sum, item) =>
      sum +
      (item.product.price *
        item.quantity *
        item.product.gst_percentage) /
        100,
    0
  )

  const discountAmount = discount ? Number(discount) : 0
  const total = subtotal + gstAmount - discountAmount
  const change = receivedAmount ? Number(receivedAmount) - total : 0

  /* -------------------- CART ACTIONS -------------------- */
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id
      )

      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("Not enough stock!")
          return prev
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            if (newQty <= 0) return null
            if (newQty > item.product.stock) {
              toast.error("Not enough stock!")
              return item
            }
            return { ...item, quantity: newQty }
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev.filter((item) => item.product.id !== productId)
    )
  }

  const clearCart = () => {
    setCart([])
    setCustomerName("")
    setCustomerPhone("")
    setDiscount("")
    setReceivedAmount("")
  }

  /* -------------------- INVOICE -------------------- */
  const generateInvoiceNumber = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `INV-${y}${m}${day}-${rnd}`
  }

  /* -------------------- CHECKOUT -------------------- */
  const handleCheckout = async () => {
    if (!shop?.id) {
      toast.error("Please set up your shop first")
      return
    }

    if (cart.length === 0) {
      toast.error("Cart is empty!")
      return
    }

    if (
      paymentMode === "cash" &&
      (!receivedAmount || Number(receivedAmount) < total)
    ) {
      toast.error("Insufficient payment amount!")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const invoiceNumber = generateInvoiceNumber()

    const items = cart.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      gst:
        (item.product.price *
          item.quantity *
          item.product.gst_percentage) /
        100,
      total:
        item.product.price * item.quantity +
        (item.product.price *
          item.quantity *
          item.product.gst_percentage) /
          100,
    }))

    const { error } = await supabase.from("transactions").insert({
      shop_id: shop.id,
      invoice_number: invoiceNumber,
      items,
      subtotal,
      gst_amount: gstAmount,
      discount: discountAmount,
      total_amount: total,
      payment_mode: paymentMode,
      payment_details: {
        [paymentMode]:
          paymentMode === "cash"
            ? Number(receivedAmount)
            : total,
      },
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      status: "success",
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    for (const item of cart) {
      await supabase
        .from("products")
        .update({
          stock: item.product.stock - item.quantity,
        })
        .eq("id", item.product.id)
    }

    setLastTransaction({
      invoiceNumber,
      items,
      subtotal,
      gstAmount,
      discount: discountAmount,
      total,
    })

    setShowBill(true)
    toast.success("Transaction completed!")
    clearCart()
    setLoading(false)
    router.refresh()
  }

  /* -------------------- UI -------------------- */
  return (
    <>
      {/* UI unchanged — your existing JSX layout stays exactly same */}
      {/* BillPreview modal */}
      {showBill && lastTransaction && shop && (
        <BillPreview
          shop={shop}
          transaction={lastTransaction}
          customerName={customerName}
          customerPhone={customerPhone}
          paymentMode={paymentMode}
          receivedAmount={
            paymentMode === "cash"
              ? Number(receivedAmount)
              : undefined
          }
          change={
            paymentMode === "cash" ? change : undefined
          }
          onClose={() => setShowBill(false)}
        />
      )}
    </>
  )
}
