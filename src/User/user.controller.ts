import { User } from "./user.entity"
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';


export const signupUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    // Generar token con el id del usuario
    const token: string = jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY || 'frasemegasecreta',
      { expiresIn: '1h' }
    );

    // Enviar el token en el header y el usuario en la respuesta
    res.header('auth-token', token).json(user);

  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOneBy({ id: parseInt(id) });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, rol } = req.body
    const user = await User.findOneBy({ id: parseInt(req.params.id) })

    if (!user) return res.status(404).json({ message: "User does not exist" })

    user.firstname = firstname
    user.lastname = lastname
    user.email = email
    user.password = password
    user.rol = rol

    await user.save()

    return res.status(200).json({ message: "User updated" })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export const delateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await User.delete({ id: parseInt(id) });

    if (result.affected === 0)
      return res.status(404).json({ message: "User not found" });

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Validar email
    const user = await User.findOneBy({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generar token con id
    const token: string = jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY || 'frasemegasecreta',
      { expiresIn: '1h' }
    );

    // Enviar el token en el header y opcionalmente información del usuario
    res.header('auth-token', token).json({ token, userId: user.id, firstname: user.firstname });

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};





export const profile = async (req: Request, res: Response) => {
  const user = await User.findOneBy({ id: parseInt(req.params.id) });
  if (!user) {
      return res.status(404).json('No User found');
  }
  res.json(user);
};