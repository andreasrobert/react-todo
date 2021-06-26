import jwt from 'jsonwebtoken';
import cookie from "cookie";

export default function (req, res, next) {
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies.token;

    // const token = req.header("auth-token");
    if(!token){
        return res.status(401).send("Access Denied");
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(error){
        res.status(400).send("Invalid token");
    }
};