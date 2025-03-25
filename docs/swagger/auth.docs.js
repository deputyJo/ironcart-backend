/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: Abcde1!@34
 *         recaptchaToken:
 *           type: string
 *           example: 03AGdBq25B7kOe8...
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Token generated! User: testUsername logged in!"
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user and get an access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful, access token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request (e.g. invalid credentials or reCAPTCHA failure)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidCredentials:
 *                 value:
 *                   message: Invalid email or password
 *               RecaptchaFailed:
 *                 value:
 *                   message: reCAPTCHA verification failed. Possible bot activity detected.
 *       403:
 *         description: Email not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               NotVerified:
 *                 value:
 *                   message: Please verify your email before logging in.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerError:
 *                 value:
 *                   message: Something went wrong, please try again later.
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh an access token using a refresh token (from cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *       403:
 *         description: Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               MissingToken:
 *                 value:
 *                   message: Refresh token required
 *               InvalidToken:
 *                 value:
 *                   message: Invalid or expired refresh token
 *       500:
 *         description: Token refresh failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerError:
 *                 value:
 *                   message: Something went wrong. Could not refresh token.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the user and clear the refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       500:
 *         description: Server error during logout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerError:
 *                 value:
 *                   message: Something went wrong. Could not log out.
 */
