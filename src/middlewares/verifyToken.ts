import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'



export interface IPayload {
    id: string;
    iat: number;
}

// Extender la interfaz Request para incluir la propiedad id
export interface CustomRequest extends Request {
    id?: string;
}

export const TokenValidation = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('token');
        if (!token) {
            return res.status(401).json({ message: 'Access Denied' });
        }

        const payload = jwt.verify(token, process.env['TOKEN_SECRET'] || 'frasemegasecreta') as IPayload;
        req.id = payload.id;
        
        next();
    } catch (e) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};