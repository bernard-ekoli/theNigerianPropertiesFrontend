import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
export default function getUser() {
    let user
    // Mock user
    const cookieStore = cookies()
    const tokenCookie = cookieStore.get('token');
    const tokenValue = tokenCookie ? tokenCookie.value : null

    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return err
        }
        user = decoded
        console.log(user)
        return user
    })

}