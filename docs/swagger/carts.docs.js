/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID
 *           example: 6430c1c4e74c2b001e6ef2a1
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2

 *     Cart:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: User ID
 *           example: 640d3540b125f70015863d97
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'

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
 *   name: Cart
 *   description: Shopping cart routes
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6430c1c4e74c2b001e6ef2a1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added to cart
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Missing or invalid product ID or quantity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidInput:
 *                 value:
 *                   message: Product ID and valid quantity are required
 *       401:
 *         description: Unauthorized – No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               NoToken:
 *                 value:
 *                   message: Access denied. No token provided.
 *       403:
 *         description: Forbidden – Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidToken:
 *                 value:
 *                   message: Invalid or expired token.
 *       500:
 *         description: Failed to add product to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerError:
 *                 value:
 *                   message: Could not update cart
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Cart'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Cart is empty
 *                     items:
 *                       type: array
 *                       items: {}
 *       401:
 *         description: Unauthorized – No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               NoToken:
 *                 value:
 *                   message: Access denied. No token provided.
 *       403:
 *         description: Forbidden – Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidToken:
 *                 value:
 *                   message: Invalid or expired token.
 *       500:
 *         description: Failed to retrieve cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerCrash:
 *                 value:
 *                   message: Failed to retrieve cart
 */
