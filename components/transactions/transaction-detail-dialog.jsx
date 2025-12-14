"use client"

import { useRef } from "react"
import { Printer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDateTime } from "@/lib/utils"

export default function TransactionDetailDialog({ transaction, open, onOpenChange }) {
  const printRef = useRef(null)

  function handlePrint() {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${transaction?.billNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; max-width: 300px; margin: 0 auto; }
            .center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .item { display: flex; justify-content: space-between; margin: 4px 0; }
            h2 { margin: 0; font-size: 16px; }
            p { margin: 4px 0; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
    printWindow.close()
  }

  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Transaction Details</DialogTitle>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-lg font-bold">{transaction.billNumber}</p>
              <p className="text-sm text-muted-foreground">{formatDateTime(transaction.createdAt)}</p>
            </div>
            <Badge
              className={
                transaction.status === "completed"
                  ? "bg-success/10 text-success"
                  : transaction.status === "pending"
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
              }
            >
              {transaction.status}
            </Badge>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Customer</p>
            <p className="font-medium">{transaction.customerName || "Walk-in Customer"}</p>
            {transaction.customerPhone && <p className="text-sm text-muted-foreground">{transaction.customerPhone}</p>}
          </div>

          <Separator />

          {/* Items */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
            <div className="space-y-2">
              {transaction.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(transaction.subtotal)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Discount ({transaction.discount}%)</span>
                <span>-{formatCurrency(transaction.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(transaction.total)}</span>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Payment Mode</p>
              <p className="font-medium capitalize">{transaction.paymentMode}</p>
            </div>
            {transaction.paymentMode === "cash" && (
              <>
                <div>
                  <p className="text-muted-foreground">Cash Received</p>
                  <p className="font-medium">{formatCurrency(transaction.cashReceived)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Change</p>
                  <p className="font-medium">{formatCurrency(transaction.change)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hidden Print Content */}
        <div ref={printRef} className="hidden">
          <div className="center">
            <h2>BILLORA STORE</h2>
            <p>123 Main Street, City</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div className="divider"></div>
          <p>Bill No: {transaction.billNumber}</p>
          <p>Date: {formatDateTime(transaction.createdAt)}</p>
          <p>Customer: {transaction.customerName || "Walk-in"}</p>
          <div className="divider"></div>
          {transaction.items?.map((item, index) => (
            <div key={index} className="item">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="divider"></div>
          <div className="item">
            <span>Subtotal:</span>
            <span>{formatCurrency(transaction.subtotal)}</span>
          </div>
          {transaction.discount > 0 && (
            <div className="item">
              <span>Discount:</span>
              <span>-{formatCurrency(transaction.discountAmount)}</span>
            </div>
          )}
          <div className="item">
            <strong>TOTAL:</strong>
            <strong>{formatCurrency(transaction.total)}</strong>
          </div>
          <div className="divider"></div>
          <p>Payment: {transaction.paymentMode?.toUpperCase()}</p>
          <div className="divider"></div>
          <div className="center">
            <p>Thank you for shopping!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
