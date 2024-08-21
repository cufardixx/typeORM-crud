import { verifyToken } from "../lib/generateToken";
import { Request, Response, NextFunction } from "express";

export interface IPayload {
    id: number;
    iat: number;
}

// Extender la interfaz Request para incluir la propiedad id
export interface CustomRequest extends Request {
    id?: number;
}

export const checkAuthToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token: any = req.header("token")
        const tokenData = await verifyToken(token) as IPayload
        console.log(tokenData);

        if (tokenData.id) {
            next()
        } else {
            res.status(409)
            res.send({ error: "you don't have credentials" })
        }

    } catch (error) {
        res.status(500).json({ message: 'error credentials' });
    }
}