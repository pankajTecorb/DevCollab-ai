import { adminModel, userModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import bcrypt from 'bcrypt';
import { errors, } from '@constants';
const jwt = require('jsonwebtoken');


/**
 * Admin registration
 * 
 * @param admin 
 * @returns 
 */
function registerAdmin(admin: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const pass = bcrypt.hashSync(admin.password, 10);
            admin.password = pass
            const response: any = await adminModel.create(admin)
            resolve(response)
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError((errors.en.adminWithSameEmail.replace('{{email}}', admin.email)), StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}

/**
 * Admin Login
 * 
 * @param body 
 * @returns 
 */

function login(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = body;
            // Check if email exists in Admin or User collection
            let user: any = await adminModel.findOne({ email, isDelete: false }).lean();
            if (!user) {
                user = await userModel.findOne({ email, isDelete: false }).lean();
            }
            if (!user) {
                throw new CustomError((errors.en.noSuchAccount.replace('{{email}}', email)), StatusCodes.BAD_REQUEST);
            }
            // const adminData: any = await adminModel.findOne({
            //     email, isDelete: false
            // })
            // if (!adminData) {
            //     reject(new CustomError((errors.en.noSuchAccount.replace('{{email}}', email)), StatusCodes.BAD_REQUEST))
            // }
            var match = bcrypt.compareSync(password, user.password);
            if (match == false) {
                reject(new CustomError(errors.en.WrongPassword, StatusCodes.BAD_REQUEST))
            } else {
                const token: string = jwt.sign({
                    id: user._id,
                    role: user.role
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })
                if (user.role == 'Admin') {
                    await adminModel.updateOne({ _id: user._id }, { token: token });
                    user.token = token
                    // Remove sensitive fields before returning response
                    user.password = undefined;
                    user.isDelete = undefined;
                    user.updatedAt = undefined;
                    resolve(user)
                } else {
                    const sessionObj = {
                        role: user.role,
                        jwtToken: token,
                        userId: user._id
                    }
                    await userSessionModel.updateOne({ userId: user._id }, sessionObj, { upsert: true, new: true })
                    resolve({
                        token,
                        name: user.name,
                        image: user?.image,
                        email: user.email,
                        role: user?.role,
                        designation: user?.designation,
                        countryCode: user?.countryCode,
                        phoneNumber: user?.phoneNumber,
                        _id: user._id
                    })
                }
            }
        } catch (err) {
            reject(err)
        }
    });
}

/**
 * Admin Change Password
 * 
 * @param body 
 * @returns 
 */

function changePassword(body: any, adminId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { password, newPassword, role = 'user' } = body;
            const newPass = bcrypt.hashSync(newPassword, 10);
            if (role == 'user') {
                const userData: any = await userModel.findOne({ _id: adminId })
                if (userData) {
                    const isMatch = await bcrypt.compare(password, userData.password);
                    if (isMatch) {
                        await userModel.updateOne({ _id: userData._id }, { password: newPass }, { new: true })
                        await userSessionModel.deleteMany({ userId: userData._id })
                        resolve({ status: true })
                    } else {
                        reject(new CustomError(errors.en.incorrectOldPass, StatusCodes.BAD_REQUEST))
                    }
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                }
            }
            const admin: any = await adminModel.findOne({ _id: adminId })
            if (admin) {
                const isMatch = await bcrypt.compare(password, admin.password);
                if (isMatch) {
                    await adminModel.updateOne({ _id: admin._id }, { password: newPass, $unset: { token: 1 } }, { new: true })
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


/**
 * Admin Update Profile
 * 
 * @param body 
 * @returns 
 */

function updateProfile(body: any, adminId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (body.role == "Admin") {
                const admin: any = await adminModel.findOne({ _id: adminId })
                if (admin) {
                    const updateData = await adminModel.updateOne({ _id: admin._id }, body)
                    resolve(updateData)
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                }
            } else if (body.role == "user") {
                const userData: any = await userModel.findOne({ _id: adminId, isDelete: false }).lean()
                if (userData) {
                    const updateData = await userModel.updateOne({ _id: adminId }, body)
                    resolve(updateData)
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.UNAUTHORIZED))
                }
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.UNAUTHORIZED))
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}
/**
 * Admin  Profile
 * 
 * @param body 
 * @returns 
 */

function adminGetDetails(adminId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let user: any = await adminModel.findOne({ _id: adminId, isDelete: false }).lean();
            if (!user) {
                user = await userModel.findOne({ _id: adminId, isDelete: false }).lean();
                if (!user) {
                    throw new CustomError(errors.en.noDatafound, StatusCodes.NOT_FOUND);
                } else {
                    resolve(user)
                }
            } else {
                resolve(user)
            }

        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}

/**
 * Admin Log Out 
 * 
 * @param body 
 * @returns 
 */

function logOut(adminId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const role = headers.role
            if (role == "Admin") {
                const admin: any = await adminModel.findOne({ _id: adminId })
                if (admin) {
                    const updateData = await adminModel.updateOne({ _id: admin._id }, { $unset: { token: 1 } }, { new: true })
                    resolve(updateData)
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
                }
            } else {
                const userData: any = await userModel.findOne({ _id: adminId })
                if (userData) {
                    const updateData = await userSessionModel.deleteOne({ userId: userData._id })
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
// Export default
export default {
    registerAdmin,
    login,
    changePassword,
    updateProfile,
    logOut,
    adminGetDetails


} as const;