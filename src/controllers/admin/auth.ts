import { adminModel } from '@models/index';
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
            const { email, password, fcmToken } = body;
            const adminData: any = await adminModel.findOne({
                email, isDelete: false
            })
            if (!adminData) {
                reject(new CustomError((errors.en.noSuchAccount.replace('{{email}}', email)), StatusCodes.BAD_REQUEST))
            }
            var match = bcrypt.compareSync(password, adminData.password);
            if (match == false) {
                reject(new CustomError(errors.en.WrongPassword, StatusCodes.BAD_REQUEST))
            } else {
                const token: string = jwt.sign({
                    id: adminData.id,
                    role: 'Admin'
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })
                adminData.set({ token: token });
                await adminData.save();
                if (fcmToken && fcmToken != "") {
                    let oldTokens = adminData?.fcmTokens ? adminData.fcmTokens : []
                    oldTokens.push(fcmToken)
                    adminData.set({ fcmTokens: oldTokens })
                    adminData.save()
                }
                adminData._doc.password = undefined
                adminData._doc.isDelete = undefined
                adminData._doc.updatedAt = undefined
                resolve(adminData._doc)
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
            const { password, newPassword } = body;
            const newPass = bcrypt.hashSync(newPassword, 10);
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
            const admin: any = await adminModel.findOne({ _id: adminId })
            if (admin) {
                const updateData = await adminModel.updateOne({ _id: admin._id }, body)
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
 * Admin  Profile
 * 
 * @param body 
 * @returns 
 */

function adminGetDetails(adminId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const adminData: any = await adminModel.findOne({ _id: adminId }).lean()
            if (adminData) {
                adminData.password=undefined
                resolve(adminData)
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
 * Admin Log Out 
 * 
 * @param body 
 * @returns 
 */

function logOut(adminId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const admin: any = await adminModel.findOne({ _id: adminId })
            if (admin) {
                const updateData = await adminModel.updateOne({ _id: admin._id }, {$unset: { token: 1 } }, { new: true })
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
// Export default
export default {
    registerAdmin,
    login,
    changePassword,
    updateProfile,
    logOut,
    adminGetDetails


} as const;