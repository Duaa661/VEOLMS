import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User Doesn't have Token. Token will be Expired. Please Login"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: "user does't have valid token"})
        }

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: `Invalid Token ${error}`
        });
    }
};