import { User } from "./user.entity"
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {
  try {

    const { firstname, lastname, email, password } = req.body;

    //encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea una instancia de User y asigna los valores
    const user = new User();
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.password = hashedPassword;


    await user.save()

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

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
    const { firstname, lastname, email, password } = req.body
    const user = await User.findOneBy({ id: parseInt(req.params.id) })

    if (!user) return res.status(404).json({ message: "User does not exist" })

    user.firstname = firstname
    user.lastname = lastname
    user.email = email
    user.password = password

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

export const loginUser = async (req: Request, res: Response) => {
  const { email, password} = req.body

  try {
    //validar Email
    const user = await User.findOneBy({ email })
    if (!user) return res.status(400).json({ message: 'email not found' })

    //Validar password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    //recuperar id y rol ademas de dejarlos en el token
    const idUser = user.id;
    const rolUser = user.rol;

    //Generar token
    const token = jwt.sign(
      { id: idUser, rol: rolUser },
      process.env.SECRET_KEY || 'frasemegasecreta',
      {
        expiresIn: 60 * 60,
      }
    );
    return res.status(200).json({ token, data: user });
  } catch (error) {
    return res.status(500).json({ message: "ERROR" })
  }

}

