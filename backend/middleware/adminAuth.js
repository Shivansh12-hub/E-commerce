import jwt from "jsonwebtoken"
export const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(req.headers)

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({
                success: false,
                message: "Not authorized, no token"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.json({ success: false, message: "Not authorized" });
        }

        next();

    } catch (error) {
        console.log("Auth Error:", error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};