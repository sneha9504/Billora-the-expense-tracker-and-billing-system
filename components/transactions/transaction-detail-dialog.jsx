"use client"

import { useRef } from "react"
import { Printer, Download, Share2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

export function TransactionDetailDialog({
  transaction,
  shop,
  open,
  onOpenChange,
}) {
  const billRef = useRef(null)

  const statusVariants = {
    success: "default",
    pending: "secondary",
    delayed: "outline",
    failed: "destructive",
  }

  const handlePrint = () => {
    const printContent = billRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${transaction.invoice_number}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              padding: 10px;
              max-width: 280px;
              margin: 0 auto;
            }
            .text-center { text-align: center; }
            .border-b { border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
            .border-t { border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px; }
            .flex { display: flex; justify-content: space-between; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Transaction Details</span>
            <Badge
              variant={statusVariants[transaction.status] || "default"}
              className="capitalize"
            >
              {transaction.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Invoice Number
              </p>
              <p className="font-mono font-medium text-primary">
                {transaction.invoice_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Date & Time
              </p>
              <p className="font-medium">
                {format(
                  new Date(transaction.created_at),
                  "dd MMM yyyy, hh:mm a"
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Customer
              </p>
              <p className="font-medium">
                {transaction.customer_name ||
                  "Walk-in Customer"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Phone
              </p>
              <p className="font-medium">
                {transaction.customer_phone || "-"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-3">
              Items ({transaction.items.length})
            </h3>
            <div className="rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Item
                    </th>
                    <th className="px-3 py-2 text-center font-medium text-muted-foreground">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                      GST
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.items.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t border-border"
                    >
                      <td className="px-3 py-2">
                        {item.product_name}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2 text-right">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        ₹{item.gst.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        ₹{item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>
              <span>
                ₹{Number(transaction.subtotal).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                GST
              </span>
              <span>
                ₹{Number(transaction.gst_amount).toFixed(2)}
              </span>
            </div>

            {Number(transaction.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Discount
                </span>
                <span className="text-destructive">
                  -₹{Number(transaction.discount).toFixed(2)}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">
                ₹
                {Number(transaction.total_amount).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm pt-2">
              <span className="text-muted-foreground">
                Payment Mode
              </span>
              <span className="capitalize">
                {transaction.payment_mode}
              </span>
            </div>
          </div>

          {/* Hidden Bill for Printing */}
          <div ref={billRef} className="hidden">
            <div className="text-center border-b pb-3 mb-3">
              <p className="font-bold">
                {shop.name.toUpperCase()}
              </p>
              {shop.address && (
                <p className="text-xs">{shop.address}</p>
              )}
              {shop.phone && (
                <p className="text-xs">
                  Tel: {shop.phone}
                </p>
              )}
              {shop.gst_number && (
                <p className="text-xs">
                  GST: {shop.gst_number}
                </p>
              )}
            </div>

            <div className="border-b pb-3 mb-3 text-xs">
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span>{transaction.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>
                  {format(
                    new Date(transaction.created_at),
                    "dd/MM/yyyy hh:mm a"
                  )}
                </span>
              </div>
            </div>

            <div className="border-b pb-3 mb-3 text-xs">
              {transaction.items.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <span>{item.product_name}</span>
                    <span>
                      ₹{item.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="pl-2 text-xs">
                    {item.quantity} × ₹
                    {item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  ₹{Number(transaction.subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST:</span>
                <span>
                  ₹{Number(transaction.gst_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>TOTAL:</span>
                <span>
                  ₹
                  {Number(transaction.total_amount).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-center border-t mt-3 pt-3 text-xs">
              {shop.receipt_footer ||
                "Thank You! Visit Again"}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>

            <Button
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>

            <Button
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
