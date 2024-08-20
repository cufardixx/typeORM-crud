import { z } from "zod"

export const schemaUser = z.object({
    id: z.number().int(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

