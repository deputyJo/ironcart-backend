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
 *         username:
 *           type: string
 *           description: Required in development (optional in production)
 *         email:
 *           type: string
 *           format: email
 *           description: Required in all environments
 *         password:
 *           type: string
 *           description: Required in all environments
 *         recaptchaToken:
 *           type: string
 *           description: Required only in production
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

 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Something went wrong
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
 *           examples:
 *             Development:
 *               summary: Login example in development environment
 *               value:
 *                 username: joanna
 *                 email: joanna@example.com
 *                 password: Abcde1!@34
 *             Production:
 *               summary: Login example in production environment
 *               value:
 *                 email: joanna@example.com
 *                 password: Abcde1!@34
 *                 recaptchaToken: 03AGdBq25B7kOe8...
 *     responses:
 *       200:
 *         description: Login successful, access token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request (invalid credentials or reCAPTCHA failure)
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
