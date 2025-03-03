import { userModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import bcrypt from 'bcrypt';




/**
 * user Login.
 * @returns 
 */
function login(body: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = body;
            const { devicetoken, devicetype, timezone, language, currentversion } = headers;
            const userData: any = await userModel.findOne({
                email,
                isDelete: false
            })
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST))
            }
            if (userData.isActive == false) {
                reject(new CustomError(errors.en.accountBlocked, StatusCodes.UNAUTHORIZED))
            }
            var match = bcrypt.compareSync(password, userData.password);
            if (match == false) {
                reject(new CustomError(errors.en.WrongPassword, StatusCodes.BAD_REQUEST))
            } else {
                const token: string = jwt.sign({
                    id: userData.id,
                    role: "user"
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })
                const sessionObj = {
                    deviceType: devicetype,
                    timezone: timezone,
                    language: language,
                    currentVersion: currentversion,
                    deviceToken: devicetoken,
                    role: "user",
                    jwtToken: token,
                    userId: userData.id
                }
                await userSessionModel.create(sessionObj)

                resolve({
                    token,
                    name: userData.name,
                    image: userData?.image,
                    email: userData.email,
                    role: userData?.role,
                    countryCode: userData?.countryCode,
                    phoneNumber: userData?.phoneNumber,
                    _id: userData._id
                })
            }
        } catch (err) {
            reject(err)
        }
    });
}

/**
 * user Account Detail
 * 
 * @param user 
 * @returns 
 */
function accountDetail(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false }).lean()
            if (userData) {
                userData.password=undefined
                resolve(userData)
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.UNAUTHORIZED))

            }
        } catch (err) {
            reject(err)
        }
    });
}


/**
 * user Account Update
 * 
 * @param user 
 * @returns 
 */
function accountUpdate(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId, isDelete: false }).lean()
            if (userData) {
                const updateData = await userModel.updateOne({ _id: userId }, body)
                resolve(updateData)
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.UNAUTHORIZED))

            }
        } catch (err) {
            reject(err)
        }
    });
}

/**
 * User Change Password
 * 
 * @param body 
 * @returns 
 */

function changePassword(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { password, newPassword } = body;
            const newPass = bcrypt.hashSync(newPassword, 10);
            const userData: any = await userModel.findOne({ _id: userId })
            if (userData) {
                const isMatch = await bcrypt.compare(password, userData.password);
                if (isMatch) {
                    await userModel.updateOne({ _id: userData._id }, { password: newPass}, { new: true })
                    await userSessionModel.deleteMany({userId:userData._id})
                    resolve({ status: true })
                } else {
                    reject(new CustomError(errors.en.incorrectOldPass, StatusCodes.BAD_REQUEST))
                }
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }

        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}


function logOut(headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const token = headers.authorization
            await userSessionModel.deleteMany({ jwtToken: token })
            resolve({ success: true })
        } catch (err) {
            reject(err)
        }
    });
}

// Export default
export default {
    login,
    logOut,
    accountDetail,
    accountUpdate,
    changePassword
} as const;
