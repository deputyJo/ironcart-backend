/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only routes
 */

/**
 * @swagger
 * /admin/all-users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   verified: true
 *             examples:
 *               Success:
 *                 value:
 *                   - username: "adminuser"
 *                     email: "admin@example.com"
 *                     role: "admin"
 *                   - username: "janedoe"
 *                     email: "jane@example.com"
 *                     role: "customer"
 *       401:
 *         description: Unauthorized - No token or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Unauthorized:
 *                 summary: No token provided
 *                 value:
 *                   message: Authorization token not provided
 *       403:
 *         description: Forbidden - Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidRole:
 *                 summary: Forbidden due to role
 *                 value:
 *                   message: You do not have permission to perform this action
 *               TokenValidation:
 *                 summary: Forbidden due to invalid/expired token
 *                 value:
 *                   message: Token is invalid or expired
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerCrash:
 *                 summary: Generic server failure
 *                 value:
 *                   message: Failed to retrieve orders
 */

/**
 * @swagger
 * /admin/all-products:
 *   get:
 *     summary: Get all products (including unpublished)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
  *       200:
 *         description: Successfully retrieved all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: Access denied. No token provided.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               token_forbidden:
 *                 summary: Invalid or expired token
 *                 value:
 *                   message: Invalid or expired token
 *               rbac_forbidden:
 *                 summary: Insufficient role
 *                 value:
 *                   message: Access denied. Insufficient permissions.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               auth_error:
 *                 summary: Token authentication failure
 *                 value:
 *                   message: Something went wrong, user token authentication error
 *               fetch_error:
 *                 summary: Product retrieval failure
 *                 value:
 *                   message: Server error. Could not retrieve products.
 */

/**
 * @swagger
 * /admin/all-orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                         quantity:
 *                           type: number
 *                   payment:
 *                     type: object
 *                     properties:
 *                       isPaid:
 *                         type: boolean
 *                       paidAt:
 *                         type: string
 *                         format: date-time
 *                       method:
 *                         type: string
 *                       transactionId:
 *                         type: string
 *                       payerEmail:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *             examples:
 *               Orders:
 *                 value:
 *                   - _id: "64abcde123"
 *                     user:
 *                       username: "joanna"
 *                       email: "joanna@example.com"
 *                     totalAmount: 499.00
 *                     status: "Paid"
 *                     items:
 *                       - product:
 *                           name: "Hoverboard"
 *                         quantity: 1
 *                     payment:
 *                       isPaid: true
 *                       paidAt: "2025-03-28T15:30:00Z"
 *                       method: "PayPal"
 *                       transactionId: "abc123xyz"
 *                       payerEmail: "joanna@paypal.com"
 *                     createdAt: "2025-03-28T15:00:00Z"
 *                     updatedAt: "2025-03-28T15:30:00Z"
 *                   - _id: "64xyz987"
 *                     user:
 *                       username: "mike"
 *                       email: "mike@example.com"
 *                     totalAmount: 1199.00
 *                     status: "Pending"
 *                     items:
 *                       - product:
 *                           name: "Smart Watch"
 *                         quantity: 2
 *                     payment:
 *                       isPaid: false
 *                       method: "Stripe Checkout"
 *                       transactionId: "pi_123456789"
 *                       payerEmail: null
 *                     createdAt: "2025-03-27T14:00:00Z"
 *                     updatedAt: "2025-03-27T14:00:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: Access denied. No token provided
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               auth_error:
 *                 value:
 *                   message: Invalid or expired token
 *               fetch_failure:
 *                 value:
 *                   message: Access denied. Insufficient permissions.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               auth_error:
 *                 summary: Token failure
 *                 value:
 *                   message: Something went wrong, user token authentication error
 *               fetch_error:
 *                 summary: Order retrieval failure
 *                 value:
 *                   message: Could not retrieve orders
 */

/**
 * @swagger
 * /admin/ban/{userId}:
 *   patch:
 *     summary: Ban a user or seller by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user or seller to ban
 *     responses:
 *       200:
 *         description: User successfully banned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               Banned:
 *                 value:
 *                   message: User banned successfully
 *       400:
 *         description: Invalid user ID or already banned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               AlreadyBanned:
 *                 value:
 *                   message: User already banned
 *               InvalidID:
 *                 value:
 *                   message: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Not an admin
 *       500:
 *         description: Server error
 */
