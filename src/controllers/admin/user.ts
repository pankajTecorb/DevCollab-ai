import { userModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import bcrypt from 'bcrypt';
import { errors, } from '@constants';
import { generatePassword, sendEmail } from '@utils/helpers';


/**
 * Admin registor user
 * 
 * @param user 
 * @returns 
 */
function registerUser(user: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const password = generatePassword(10)
            const pass = bcrypt.hashSync(password, 10);
            user.password = pass
            user.role = "user"
            const response: any = await userModel.create(user)
            const emailObj = {
                subject: `Welcome ${user.name}! Your Account is Ready 🎉`,
                email: user.email,
                password: password,
                url: "https://devcollabllm.vercel.app/login",
                name: user.name
            }
            sendEmail(emailObj)
            resolve(response)
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError((errors.en.emailExist.replace('{{email}}', user.email)), StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}
/**
 * Admin Get User Profile
 * 
 * @param body 
 * @returns 
 */

function adminGetUserDetails(userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId }).lean()
            if (userData) {
                userData.password=undefined
                resolve(userData)
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}
/**
 * Admin Update User Profile
 * 
 * @param body 
 * @returns 
 */

function updateProfile(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId })
            if (userData) {
                const updateData = await userModel.updateOne({ _id: userData._id }, body)
                resolve(updateData)
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}

/**
 * Admin Delete User 
 * 
 * @param body 
 * @returns 
 */

function adminDeleteUser(userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const userData: any = await userModel.findOne({ _id: userId })
            if (userData) {
                const updateData = await userModel.updateOne({ _id: userData._id }, { isDelete: true }, { new: true })
                resolve(updateData)
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}

/**
 * Admin User Status Change
 * 
 * @param body 
 * @returns 
 */
function adminUserStatus(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (body.isActive == undefined) {
                reject(new CustomError(errors.en.emptyBody, StatusCodes.BAD_REQUEST))
            } else {
                const userData: any = await userModel.findOne({ _id: userId })
                if (userData) {
                    const updateData = await userModel.updateOne({ _id: userData._id }, { isActive: body.isActive }, { new: true })
                    resolve(updateData)
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                }
            }

        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}

/**
 * Admin User List 
 * 
 * @param query 
 * @returns 
 */
function adminUserList(query: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, pageSize = 10, search, fromDate, toDate } = query;
            let condition: any = {
                isDelete: false,

            };

            if (search && search != "") {
                condition = {
                    ...condition,
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                        { phoneNumber: { $regex: search, $options: "i" } },
                        { designation: { $regex: search, $options: "i" } },

                    ],
                };
            }
            if (fromDate && fromDate != null && fromDate != undefined && fromDate != "" || toDate && toDate != null && toDate != undefined && toDate != "") {
                condition = {
                    ...condition,
                    createdAt: { $gte: fromDate, $lte: toDate }
                }
            }
            const response = await userModel.aggregate([
                { $match: condition },
                { $sort: { createdAt: -1 } },
                { $skip: Number(page - 1) * Number(pageSize) },
                { $limit: Number(pageSize) },
                {
                    $project: {
                        isDelete: 0, updatedAt: 0, role: 0, password: 0, isPhoneVerified: 0
                    }
                }
            ]);
            const total = await userModel.aggregate([
                { $match: condition },
               {
                    $project: {
                        _id: 1, 
                    }
                }
            ]);
            if (response.length>0) {
                resolve({response,Total:total.length})
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}
// Export default
export default {
    registerUser,
    updateProfile,
    adminDeleteUser,
    adminUserStatus,
    adminUserList,
    adminGetUserDetails

} as const;