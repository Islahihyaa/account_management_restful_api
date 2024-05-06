import { validate } from "../validation/validation.js";
import { getUserValidation, loginUserValidation, registerUserValidation } from "../validation/user-validation.js";
import { prismaCLient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request); 

    const countUser = await prismaCLient.user.count({
        where: {
            username: user.username
        }
    });

    if(countUser === 1 ) {
        throw new ResponseError(400, "Username Already Exist")
    }

    user.password = await bcrypt.hash(user.password, 10)

    return prismaCLient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    })
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaCLient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    });

    if(!user) {
        throw new ResponseError(401, "Username or Password Wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or Password Wrong");
    }

    const token = uuid().toString()
    return prismaCLient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });
}

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaCLient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    })

    if(!user) {
        throw new ResponseError(404, "User is not found!")
    }

    return user;

}

export default {
    register,
    login,
    get
}