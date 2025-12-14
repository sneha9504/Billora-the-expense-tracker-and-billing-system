export interface Shop {
  id: string
  user_id: string
  name: string
  logo?: string
  address?: string
  gst_number?: string
  phone?: string
  email?: string
  tax_rate: number
  currency: string
  receipt_header?: string
  receipt_footer?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  shop_id: string
  name: string
  sku?: string
  barcode?: string
  category: string
  brand?: string
  price: number
  cost_price: number
  gst_percentage: number
  stock: number
  reorder_level: number
  unit: string
  image?: string
  description?: string
  expiry_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TransactionItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
  gst: number
  total: number
}

export interface Transaction {
  id: string
  shop_id: string
  invoice_number: string
  items: TransactionItem[]
  subtotal: number
  gst_amount: number
  discount: number
  total_amount: number
  payment_mode: "cash" | "card" | "upi" | "multiple"
  payment_details: {
    cash?: number
    card?: number
    upi?: number
  }
  customer_name?: string
  customer_phone?: string
  status: "success" | "pending" | "delayed" | "failed"
  created_at: string
}

export interface Expense {
  id: string
  shop_id: string
  category: string
  amount: number
  vendor?: string
  payment_mode: string
  description?: string
  receipt?: string
  date: string
  is_recurring: boolean
  recurring_frequency?: "monthly" | "weekly" | "yearly"
  created_at: string
}

export interface Category {
  id: string
  shop_id: string
  name: string
  icon?: string
  created_at: string
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  avgPrice: number
  productsSold: number
  pendingTransactions: Transaction[]
  recentTransactions: Transaction[]
}
