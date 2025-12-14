"use client"

import { useRef } from "react"
import { Printer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime } from "@/lib/utils"

export default function BillPreview({ bill, open, onOpenChange }) {
  const printRef = useRef(null)

  function handlePrint() {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${bill?.billNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; max-width: 300px; margin: 0 auto; }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .item { display: flex; justify-content: space-between; margin: 4px 0; }
            .item-name { max-width: 150px; }
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

  if (!bill) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Bill Preview</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Thermal Receipt Style Bill */}
        <div ref={printRef} className="rounded-lg border bg-white p-4 font-mono text-xs text-black">
          <div className="text-center">
            <h2 className="text-lg font-bold">BILLORA STORE</h2>
            <p>123 Main Street, City</p>
            <p>Phone: +91 98765 43210</p>
            <p>GSTIN: 29AABCU9603R1ZM</p>
          </div>

          <div className="my-3 border-t border-dashed border-gray-400" />

          <div className="flex justify-between">
            <span>Bill No:</span>
            <span className="font-bold">{bill.billNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{formatDateTime(new Date())}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{bill.customerName}</span>
          </div>
          {bill.customerPhone && (
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{bill.customerPhone}</span>
            </div>
          )}

          <div className="my-3 border-t border-dashed border-gray-400" />

          <div className="space-y-1">
            {bill.items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <span className="truncate max-w-[150px]">{item.name}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
                <div className="text-[10px] text-gray-600">
                  {item.quantity} x {formatCurrency(item.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="my-3 border-t border-dashed border-gray-400" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(bill.subtotal)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount ({bill.discount}%):</span>
                <span>-{formatCurrency(bill.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm">
              <span>TOTAL:</span>
              <span>{formatCurrency(bill.total)}</span>
            </div>
          </div>

          <div className="my-3 border-t border-dashed border-gray-400" />

          <div className="flex justify-between">
            <span>Payment Mode:</span>
            <span className="uppercase">{bill.paymentMode}</span>
          </div>
          {bill.paymentMode === "cash" && (
            <>
              <div className="flex justify-between">
                <span>Cash Received:</span>
                <span>{formatCurrency(bill.cashReceived)}</span>
              </div>
              <div className="flex justify-between">
                <span>Change:</span>
                <span>{formatCurrency(bill.change)}</span>
              </div>
            </>
          )}

          <div className="my-3 border-t border-dashed border-gray-400" />

          <div className="text-center text-[10px]">
            <p>Thank you for shopping with us!</p>
            <p>Visit again soon</p>
            <p className="mt-2">*** Powered by Billora ***</p>
          </div>
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full">
          Done
        </Button>
      </DialogContent>
    </Dialog>
  )
}
