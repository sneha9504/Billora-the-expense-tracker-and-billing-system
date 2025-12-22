"use client"

import { useRef } from "react"
import { X, Printer, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export function BillPreview({
  shop,
  transaction,
  customerName,
  customerPhone,
  paymentMode,
  receivedAmount,
  change,
  onClose,
}) {
  const billRef = useRef(null)

  const handlePrint = () => {
    const printContent = billRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - ${transaction.invoiceNumber}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              padding: 10px;
              max-width: 280px;
              margin: 0 auto;
            }
            .text-center { text-align: center; }
            .border-b {
              border-bottom: 1px dashed #000;
              padding-bottom: 8px;
              margin-bottom: 8px;
            }
            .flex {
              display: flex;
              justify-content: space-between;
            }
            .font-bold { font-weight: bold; }
            .mt-2 { margin-top: 8px; }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Bill Preview</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Bill Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div
            ref={billRef}
            className="font-mono text-sm bg-background p-4 rounded-lg border border-border"
          >
            {/* Shop Header */}
            <div className="text-center border-b border-dashed border-border pb-3 mb-3">
              <p className="text-base font-bold">
                {shop.name?.toUpperCase()}
              </p>

              {shop.receipt_header && (
                <p className="text-xs text-muted-foreground">
                  {shop.receipt_header}
                </p>
              )}

              {shop.address && (
                <p className="text-xs text-muted-foreground">
                  {shop.address}
                </p>
              )}

              {shop.phone && (
                <p className="text-xs text-muted-foreground">
                  Tel: {shop.phone}
                </p>
              )}

              {shop.gst_number && (
                <p className="text-xs text-muted-foreground">
                  GST: {shop.gst_number}
                </p>
              )}
            </div>

            {/* Invoice Info */}
            <div className="border-b border-dashed border-border pb-3 mb-3 text-xs">
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span>{transaction.invoiceNumber}</span>
              </div>

              <div className="flex justify-between">
                <span>Date:</span>
                <span>{format(new Date(), "dd/MM/yyyy hh:mm a")}</span>
              </div>

              {customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{customerName}</span>
                </div>
              )}

              {customerPhone && (
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{customerPhone}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="border-b border-dashed border-border pb-3 mb-3">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Item</span>
                <span>Amount</span>
              </div>

              {transaction.items.map((item, index) => (
                <div key={index} className="text-xs">
                  <div className="flex justify-between">
                    <span className="flex-1 truncate">
                      {item.product_name}
                    </span>
                    <span>₹{item.total.toFixed(2)}</span>
                  </div>

                  <div className="text-muted-foreground pl-2">
                    {item.quantity} x ₹{item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{transaction.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST:</span>
                <span>₹{transaction.gstAmount.toFixed(2)}</span>
              </div>

              {transaction.discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{transaction.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-sm border-t border-dashed border-border pt-2 mt-2">
                <span>TOTAL:</span>
                <span>₹{transaction.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t border-dashed border-border mt-3 pt-3 text-xs">
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="capitalize">{paymentMode}</span>
              </div>

              {receivedAmount !== undefined && (
                <>
                  <div className="flex justify-between">
                    <span>Received:</span>
                    <span>₹{receivedAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>₹{change?.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="text-center border-t border-dashed border-border mt-3 pt-3 text-xs text-muted-foreground">
              {shop.receipt_footer || "Thank You! Visit Again"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t border-border">
          <Button
            variant="outline"
            className="flex-1 gap-2 bg-transparent"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>

          <Button variant="outline" className="flex-1 gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download
          </Button>

          <Button variant="outline" className="flex-1 gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
