import { createTransport } from "nodemailer"

// Email configuration
const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Email templates
const emailTemplates = {
  newOrder: (order: any) => ({
    subject: `New Order #${order.id.substring(0, 8)} Received!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #e783bd; padding: 20px; text-align: center; color: white;">
          <h1>New Order Received!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e783bd; border-top: none;">
          <p>Hello Admin,</p>
          <p>A new order has been placed on DessertPrint.</p>
          <h2>Order Details:</h2>
          <p><strong>Order ID:</strong> ${order.id.substring(0, 8)}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Email:</strong> ${order.customer_email}</p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
          
          <h3>Items:</h3>
          <ul>
            ${
              order.items
                ?.map(
                  (item: any) => `
              <li>
                ${item.quantity}x ${item.product_name} - $${(item.price * item.quantity).toFixed(2)}
              </li>
            `,
                )
                .join("") || "No items"
            }
          </ul>
          
          <p>Please log in to the admin dashboard to process this order.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
               style="background-color: #e783bd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Dashboard
            </a>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} DessertPrint. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  orderConfirmation: (order: any, customer: any) => ({
    subject: `Your DessertPrint Order #${order.id.substring(0, 8)} is Confirmed!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #e783bd; padding: 20px; text-align: center; color: white;">
          <h1>Thank You for Your Order!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e783bd; border-top: none;">
          <p>Hello ${customer.name},</p>
          <p>Thank you for your order with DessertPrint. We're excited to create your custom treats!</p>
          <h2>Order Details:</h2>
          <p><strong>Order ID:</strong> ${order.id.substring(0, 8)}</p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
          
          <h3>Items:</h3>
          <ul>
            ${
              order.items
                ?.map(
                  (item: any) => `
              <li>
                ${item.quantity}x ${item.product_name} - $${(item.price * item.quantity).toFixed(2)}
              </li>
            `,
                )
                .join("") || "No items"
            }
          </ul>
          
          <p>We'll notify you when your order is ready to ship.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" 
               style="background-color: #e783bd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Track Your Order
            </a>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} DessertPrint. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  lowStockAlert: (product: any) => ({
    subject: `Low Stock Alert: ${product.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #e783bd; padding: 20px; text-align: center; color: white;">
          <h1>Low Stock Alert</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e783bd; border-top: none;">
          <p>Hello Admin,</p>
          <p>This is an automated alert to inform you that the following product is running low on stock:</p>
          <div style="background-color: #fff4f4; padding: 15px; border-left: 4px solid #ff6b6b; margin: 20px 0;">
            <h3>${product.name}</h3>
            <p><strong>Current Stock:</strong> ${product.stock} units</p>
            <p><strong>Category:</strong> ${product.category}</p>
          </div>
          <p>Please restock this item soon to avoid stockouts.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
               style="background-color: #e783bd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Go to Admin Dashboard
            </a>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} DessertPrint. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
}

// Send email function
export async function sendEmail(to: string, template: keyof typeof emailTemplates, data: any) {
  try {
    const { subject, html } = emailTemplates[template](data)

    const mailOptions = {
      from: `"DessertPrint" <${process.env.EMAIL_FROM || "noreply@dessertprint.com"}>`,
      to,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

// Send notification to admin when new order is placed
export async function sendNewOrderNotification(order: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dessertprint.com"
  return sendEmail(adminEmail, "newOrder", order)
}

// Send order confirmation to customer
export async function sendOrderConfirmation(order: any, customer: any) {
  return sendEmail(customer.email, "orderConfirmation", { order, customer })
}

// Send low stock alert to admin
export async function sendLowStockAlert(product: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dessertprint.com"
  return sendEmail(adminEmail, "lowStockAlert", product)
}
