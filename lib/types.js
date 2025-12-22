/**
 * @typedef {Object} Shop
 * @property {string} id
 * @property {string} user_id
 * @property {string} name
 * @property {string} [logo]
 * @property {string} [address]
 * @property {string} [gst_number]
 * @property {string} [phone]
 * @property {string} [email]
 * @property {number} tax_rate
 * @property {string} currency
 * @property {string} [receipt_header]
 * @property {string} [receipt_footer]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} shop_id
 * @property {string} name
 * @property {string} [sku]
 * @property {string} [barcode]
 * @property {string} category
 * @property {string} [brand]
 * @property {number} price
 * @property {number} cost_price
 * @property {number} gst_percentage
 * @property {number} stock
 * @property {number} reorder_level
 * @property {string} unit
 * @property {string} [image]
 * @property {string} [description]
 * @property {string} [expiry_date]
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} TransactionItem
 * @property {string} product_id
 * @property {string} product_name
 * @property {number} quantity
 * @property {number} price
 * @property {number} gst
 * @property {number} total
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} shop_id
 * @property {string} invoice_number
 * @property {TransactionItem[]} items
 * @property {number} subtotal
 * @property {number} gst_amount
 * @property {number} discount
 * @property {number} total_amount
 * @property {"cash"|"card"|"upi"|"multiple"} payment_mode
 * @property {{ cash?: number, card?: number, upi?: number }} payment_details
 * @property {string} [customer_name]
 * @property {string} [customer_phone]
 * @property {"success"|"pending"|"delayed"|"failed"} status
 * @property {string} created_at
 */

/**
 * @typedef {Object} Expense
 * @property {string} id
 * @property {string} shop_id
 * @property {string} category
 * @property {number} amount
 * @property {string} [vendor]
 * @property {string} payment_mode
 * @property {string} [description]
 * @property {string} [receipt]
 * @property {string} date
 * @property {boolean} is_recurring
 * @property {"monthly"|"weekly"|"yearly"} [recurring_frequency]
 * @property {string} created_at
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} shop_id
 * @property {string} name
 * @property {string} [icon]
 * @property {string} created_at
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalOrders
 * @property {number} totalRevenue
 * @property {number} avgPrice
 * @property {number} productsSold
 * @property {Transaction[]} pendingTransactions
 * @property {Transaction[]} recentTransactions
 */
