const swaggerJsdoc = require("swagger-jsdoc");

const options = {

    definition: {
        openapi: "3.0.0",
        // API metadata
        info: {
            title: "IronCart API",
            version: "1.0.0",
            description: "Backend API documentation for IronCart e-commerce platform",
        },
        servers: [
            {
                url: "http://localhost:3000", // Update to prod URL after deployment
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/*.js', './docs/swagger/*.js'], // Scan route files for annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
