/**
 * @swagger
 * components:
 *   schemas:
 *     StripeSessionResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Stripe Checkout session URL
 *           example: https://checkout.stripe.com/c/pay/cs_test_abc123

 *     StripeWebhookResponse:
 *       type: object
 *       properties:
 *         received:
 *           type: boolean
 *           example: true

 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Something went wrong
 */

/**
 * @swagger
 * /payment/create-session:
 *   post:
 *     summary: Create a Stripe Checkout session
 *     tags: [Payments]
 *     description: |
 *       Creates a Stripe Checkout session using the current user's cart. 
 *       Requires authentication via Bearer token. Cart must not be empty.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stripe session URL created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StripeSessionResponse'
 *       400:
 *         description: Invalid request (e.g., empty cart)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - token missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Stripe session creation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /webhook:
 *   post:
 *     summary: Stripe Webhook Endpoint
 *     tags: [Stripe Webhook]
 *     description: |
 *       Handles Stripe events like `checkout.session.completed` to update order status.
 *       This endpoint is called by Stripe and uses a raw body parser for signature verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Raw Stripe event payload
 *     responses:
 *       200:
 *         description: Webhook received and processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StripeWebhookResponse'
 *       400:
 *         description: Invalid signature or webhook error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
