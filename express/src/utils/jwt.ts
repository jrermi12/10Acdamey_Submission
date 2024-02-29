import jwt from "jsonwebtoken";


export function signJwt(
    object: Object,
    signKey: string,
    options?: jwt.SignOptions | undefined
) {
    return jwt.sign(object, signKey, {
        ...(options && options),
    });
}
