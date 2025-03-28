/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: testUsername
 *           description: User's chosen display name
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Abcde1!@34
 *         recaptchaToken:
 *           type: string
 *           example: 03AGdBq25B7kOe8...
 *           description: Required only in production
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Logged out successfully
 *
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
 *   name: Users
 *   description: User management routes
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             Development:
 *               summary: Register (Development)
 *               value:
 *                 username: joanna
 *                 email: joanna@example.com
 *                 password: Abcde1!@34
 *             Production:
 *               summary: Register (Production)
 *               value:
 *                 username: joanna
 *                 email: joanna@example.com
 *                 password: Abcde1!@34
 *                 recaptchaToken: 03AGdBq25B7kOe8...
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered! Please check your email for verification.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               RecaptchaFailed:
 *                 value:
 *                   message: reCAPTCHA verification failed. Possible bot activity detected.
 *               UserExists:
 *                 value:
 *                   message: User already exists. Please sign in.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: Authorization token not provided or invalid
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerCrash:
 *                 value:
 *                   message: Something went wrong, user registration failure.
 */

/**
 * @swagger
 * /users/verify/{token}:
 *   get:
 *     summary: Verify the user's email with a token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Token validated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email successfully verified! You can now log in.
 *       400:
 *         description: Invalid token or request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidToken:
 *                 value:
 *                   message: Invalid or expired token
 *       401:
 *         description: Unauthorized (Authentication required)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   message: Unauthorized (Authentication required)
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Forbidden:
 *                 value:
 *                   message: Forbidden (Client lacks permission)
 *       404:
 *         description: Token not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               NotFound:
 *                 value:
 *                   message: No token to validate
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerCrash:
 *                 value:
 *                   message: Something went wrong, email could not be verified.
 */

// /**
//  * @swagger
//  * /users/all-users:
//  *   get:
//  *     summary: Retrieve all users (Admin only)
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved all users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/RegisterRequest'
//  *       401:
//  *         description: Access denied. No token provided.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  *             examples:
//  *               Unauthorized:
//  *                 value:
//  *                   message: Access denied. No token provided.
//  *       403:
//  *         description: Invalid or insufficient permissions.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  *             examples:
//  *               Forbidden:
//  *                 value:
//  *                   message: Access denied. Insufficient permissions.
//  *       500:
//  *         description: Server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  *             examples:
//  *               ServerCrash:
//  *                 value:
//  *                   message: Something went wrong, user token authentication error.
//  */
