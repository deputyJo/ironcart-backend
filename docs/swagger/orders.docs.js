/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID
 *           example: 6430c1c4e74c2b001e6ef2a1
 *         quantity:
 *           type: number
 *           example: 2
 *
 *     Order:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: User ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *           example: 99.99
 *         status:
 *           type: string
 *           enum: [Pending, Paid, Shipped, Delivered]
 *           example: Pending
 *         payment:
 *           type: object
 *           properties:
 *             isPaid:
 *               type: boolean
 *               example: false
 *             paidAt:
 *               type: string
 *               format: date-time
 *             method:
 *               type: string
 *               example: FakeGateway

 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Something went wrong
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management routes
 */

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Create a new order (checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order placed successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request (e.g., empty cart or stock issues)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               EmptyCart:
 *                 value:
 *                   message: Your cart is empty
 *               OutOfStock:
 *                 value:
 *                   message: Insufficient stock for ProductName
 *       402:
 *         description: Payment failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               PaymentFailed:
 *                 value:
 *                   message: Payment failed. Try again.
 *       500:
 *         description: Order creation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerCrash:
 *                 value:
 *                   message: Order failed
 */

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Failed to retrieve user orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerCrash:
 *                 value:
 *                   message: Could not retrieve your orders
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (admin/seller)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Failed to retrieve orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerCrash:
 *                 value:
 *                   message: Could not retrieve orders
 */

/**
 * @swagger
 * /orders/{orderId}/status:
 *   put:
 *     summary: Update an order's status (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered]
 *                 example: Shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order status updated
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidStatus:
 *                 value:
 *                   message: Invalid status
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               NotFound:
 *                 value:
 *                   message: Order not found
 *       500:
 *         description: Failed to update order status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerCrash:
 *                 value:
 *                   message: Failed to update order status
 */
