const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    try { 
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization token required",
        });
    }

const [type, token] = authHeader.split(" ");

if (type !== "Bearer" || !token) {
    return res.status(401).json({
        message: "Invalid authroization format",
    });
}
console.log("JWT_TOKEN during verify:", process.env.JWT_TOKEN);
console.log("Authorization header:", req.headers.authorization);
    const decoded = jwt.verify(
        token,
        process.env.JWT_TOKEN
    );

    req.user = decoded;

    next();
} catch (error) {
    res.status(401).json ({
        message: "Invalid or expired token"
         });
    }
}

module.exports = auth;