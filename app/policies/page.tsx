import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { H1Card } from "@/components/h1-card"

export default function PoliciesPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <H1Card>Our Policies</H1Card>
        <p className="max-w-[700px] text-rose-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Important information about our terms, privacy, shipping, and returns
        </p>
      </div>

      <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
        <CardContent className="p-6 md:p-8">
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="terms" className="text-lg">
                Terms & Conditions
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-lg">
                Privacy Policy
              </TabsTrigger>
              <TabsTrigger value="shipping" className="text-lg">
                Shipping Policy
              </TabsTrigger>
              <TabsTrigger value="returns" className="text-lg">
                Returns & Refunds
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="space-y-4">
              <div className="prose max-w-none">
                <h2>Terms and Conditions</h2>
                <p>
                  Welcome to Dessert Print Inc. By accessing and using our website and services, you agree to be bound
                  by these Terms and Conditions.
                </p>

                <h3>1. Use of Our Website</h3>
                <p>
                  You may use our website for lawful purposes only. You must not use our website in any way that causes,
                  or may cause, damage to the website or impairment of the availability or accessibility of the website.
                </p>

                <h3>2. Products and Services</h3>
                <p>
                  All products and services are subject to availability. We reserve the right to discontinue any product
                  or service at any time. Prices for our products are subject to change without notice.
                </p>

                <h3>3. Orders</h3>
                <p>
                  When you place an order with us, you are making an offer to purchase our products. We reserve the
                  right to refuse or cancel any order for any reason, including but not limited to product availability,
                  errors in product or pricing information, or problems identified by our fraud detection systems.
                </p>

                <h3>4. Custom Designs</h3>
                <p>
                  By submitting a custom design, you confirm that you have the right to use any images, logos, or other
                  content included in your design. We reserve the right to refuse any design that we believe infringes
                  on copyright or contains inappropriate content.
                </p>

                <h3>5. Intellectual Property</h3>
                <p>
                  All content on our website, including but not limited to text, graphics, logos, images, and software,
                  is the property of Dessert Print Inc and is protected by copyright and other intellectual property
                  laws.
                </p>

                <h3>6. Limitation of Liability</h3>
                <p>
                  Dessert Print Inc shall not be liable for any indirect, incidental, special, consequential, or
                  punitive damages resulting from your use of or inability to use our website or services.
                </p>

                <h3>7. Governing Law</h3>
                <p>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of the state
                  where Dessert Print Inc is registered, without regard to its conflict of law provisions.
                </p>

                <h3>8. Changes to Terms</h3>
                <p>
                  We reserve the right to modify these Terms and Conditions at any time. Your continued use of our
                  website after any changes indicates your acceptance of the new Terms and Conditions.
                </p>

                <p>Last updated: April 28, 2025</p>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <div className="prose max-w-none">
                <h2>Privacy Policy</h2>
                <p>
                  At Dessert Print Inc, we are committed to protecting your privacy. This Privacy Policy explains how we
                  collect, use, and safeguard your information when you visit our website or use our services.
                </p>

                <h3>1. Information We Collect</h3>
                <p>We may collect the following types of information:</p>
                <ul>
                  <li>
                    Personal Information: Name, email address, phone number, billing address, shipping address, and
                    payment information.
                  </li>
                  <li>
                    Order Information: Products purchased, order history, and custom design files uploaded to our
                    website.
                  </li>
                  <li>Technical Information: IP address, browser type, device information, and cookies.</li>
                </ul>

                <h3>2. How We Use Your Information</h3>
                <p>We use your information for the following purposes:</p>
                <ul>
                  <li>To process and fulfill your orders</li>
                  <li>To communicate with you about your orders and account</li>
                  <li>To improve our website and services</li>
                  <li>To send promotional emails and newsletters (if you have opted in)</li>
                  <li>To comply with legal obligations</li>
                </ul>

                <h3>3. Information Sharing</h3>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to outside parties except as
                  described below:
                </p>
                <ul>
                  <li>Service providers who assist us in operating our website and conducting our business</li>
                  <li>Legal authorities when required by law or to protect our rights</li>
                  <li>In the event of a merger, acquisition, or sale of all or a portion of our assets</li>
                </ul>

                <h3>4. Data Security</h3>
                <p>
                  We implement appropriate security measures to protect your personal information. However, no method of
                  transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
                  security.
                </p>

                <h3>5. Cookies</h3>
                <p>
                  We use cookies to enhance your experience on our website. You can set your browser to refuse all or
                  some browser cookies, but this may prevent some parts of our website from functioning properly.
                </p>

                <h3>6. Your Rights</h3>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, including
                  the right to access, correct, delete, or restrict processing of your data.
                </p>

                <h3>7. Changes to This Policy</h3>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page.
                </p>

                <p>Last updated: April 28, 2025</p>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="space-y-4">
              <div className="prose max-w-none">
                <h2>Shipping Policy</h2>
                <p>
                  At Dessert Print Inc, we take great care to ensure your custom treats arrive in perfect condition.
                  Please review our shipping policy below.
                </p>

                <h3>1. Processing Time</h3>
                <p>
                  Standard orders typically require 3-5 business days for processing before shipping. Large or complex
                  custom orders may require additional processing time. Rush orders may be available for an additional
                  fee, subject to availability.
                </p>

                <h3>2. Shipping Methods</h3>
                <p>We offer the following shipping options:</p>
                <ul>
                  <li>Standard Shipping: 3-5 business days</li>
                  <li>Express Shipping: 2 business days</li>
                  <li>Overnight Shipping: Next business day (order must be placed before 12 PM EST)</li>
                </ul>

                <h3>3. Shipping Costs</h3>
                <p>
                  Shipping costs are calculated based on the weight of your order, shipping method, and destination.
                  Shipping costs will be displayed during checkout before you complete your purchase.
                </p>
                <p>Free standard shipping is available for orders over $50 within the continental United States.</p>

                <h3>4. Delivery Areas</h3>
                <p>We ship to all 50 United States. International shipping is currently not available.</p>

                <h3>5. Tracking Information</h3>
                <p>
                  Once your order has shipped, you will receive a confirmation email with tracking information. You can
                  also track your order by logging into your account on our website.
                </p>

                <h3>6. Delivery Issues</h3>
                <p>
                  If your package is damaged during shipping, please contact us within 24 hours of delivery with photos
                  of the damaged package and products. We will work with you to resolve the issue promptly.
                </p>
                <p>
                  We are not responsible for packages that are lost or stolen after they have been delivered to the
                  address provided at checkout. Please ensure someone is available to receive your package or provide
                  delivery instructions.
                </p>

                <h3>7. Special Considerations</h3>
                <p>
                  Our products are perishable and may be affected by extreme temperatures. During hot weather months
                  (May-September), we recommend selecting expedited shipping options to ensure your treats arrive in the
                  best condition.
                </p>

                <p>Last updated: April 28, 2025</p>
              </div>
            </TabsContent>

            <TabsContent value="returns" className="space-y-4">
              <div className="prose max-w-none">
                <h2>Returns and Refunds Policy</h2>
                <p>
                  Due to the perishable and custom nature of our products, we have a limited returns and refunds policy.
                  Please review the information below carefully.
                </p>

                <h3>1. Custom Orders</h3>
                <p>
                  All custom orders are final sale and cannot be returned or refunded. This includes all cookies and
                  chocolate bars with custom designs.
                </p>

                <h3>2. Damaged or Incorrect Orders</h3>
                <p>
                  If your order arrives damaged or incorrect, please contact us within 24 hours of delivery. You will
                  need to provide:
                </p>
                <ul>
                  <li>Your order number</li>
                  <li>A description of the issue</li>
                  <li>Photos of the damaged or incorrect items</li>
                </ul>
                <p>
                  If we confirm that the order was damaged during shipping or that we made an error, we will offer a
                  replacement or refund at our discretion.
                </p>

                <h3>3. Cancellations</h3>
                <p>
                  Orders can be canceled within 24 hours of placement, provided that production has not yet begun. To
                  cancel an order, please contact us immediately with your order number.
                </p>
                <p>
                  Orders that have already entered production cannot be canceled and are subject to our standard return
                  policy.
                </p>

                <h3>4. Refund Process</h3>
                <p>
                  If a refund is approved, it will be processed to the original payment method within 5-7 business days.
                  Please note that it may take additional time for the refund to appear on your account, depending on
                  your payment provider.
                </p>

                <h3>5. Quality Guarantee</h3>
                <p>
                  We stand behind the quality of our products. If you are not satisfied with the quality of your order
                  for reasons other than shipping damage, please contact us within 48 hours of delivery. We will
                  evaluate each situation on a case-by-case basis.
                </p>

                <h3>6. Contact Information</h3>
                <p>For all returns, refunds, or quality concerns, please contact our customer service team at:</p>
                <ul>
                  <li>Email: returns@dessertprint.com</li>
                  <li>Phone: (123) 456-7890</li>
                </ul>

                <p>Last updated: April 28, 2025</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
