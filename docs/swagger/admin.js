/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only routes
 */

/**
 * @swagger
 * /admin/users:
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Not an admin
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/products:
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
 *       403:
 *         description: Forbidden – Not an admin
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/orders:
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Not an admin
 *       500:
 *         description: Server error
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
 *                   example: User banned successfully
 *       400:
 *         description: Invalid user ID or already banned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Not an admin
 *       500:
 *         description: Server error
 */
