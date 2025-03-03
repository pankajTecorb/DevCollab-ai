import { projectModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors, } from '@constants';
import { identityGenerator } from '@utils/helpers';


/**
 * Admin registor Project
 * 
 * @param user 
 * @returns 
 */
function registerProject(body: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const response: any = await projectModel.create(body)
            resolve(response)
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError((errors.en.projectExist.replace('{{name}}', body.name)), StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}

/**
 * Admin Update Project
 * 
 * @param body 
 * @returns 
 */

function updateProject(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const admin: any = await projectModel.findOne({ _id: userId })
            if (admin) {
                const updateData = await projectModel.updateOne({ _id: admin._id }, body)
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
 * Admin Project Details 
 * 
 * @param body 
 * @returns 
 */
function adminProjectDetail(userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
             const admin: any = await projectModel.findOne({ _id: userId }).lean()
                if (admin) {
                    resolve(admin)
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
 * Admin Delete Project 
 * 
 * @param body 
 * @returns 
 */

function adminDeleteProject(adminId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const admin: any = await projectModel.findOne({ _id: adminId })
            if (admin) {
                const updateData = await projectModel.updateOne({ _id: admin._id }, { isDelete: true }, { new: true })
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
 * Admin Project Status Change
 * 
 * @param body 
 * @returns 
 */
function adminProjectStatus(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (body.isActive == undefined) {
                reject(new CustomError(errors.en.emptyBody, StatusCodes.BAD_REQUEST))
            } else {
                const admin: any = await projectModel.findOne({ _id: userId })
                if (admin) {
                    const updateData = await projectModel.updateOne({ _id: admin._id }, { isActive: body.isActive }, { new: true })
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
 * Admin Project List 
 * 
 * @param query 
 * @returns 
 */
function adminProjectList(query: any, userId: string): Promise<any> {
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
                        { description: { $regex: search, $options: "i" } },
                      
 ],
                };
            }
            if (fromDate && fromDate != null && fromDate != undefined && fromDate != "" || toDate && toDate != null && toDate != undefined && toDate != "") {
                condition = {
                    ...condition,
                    createdAt: { $gte: fromDate, $lte: toDate }
                }
            }
            const response = await projectModel.aggregate([
                { $match: condition },
                { $sort: { createdAt: -1 } },
                { $skip: Number(page - 1) * Number(pageSize) },
                { $limit: Number(pageSize) },
                {
                    $project: {
                        isDelete: 0, updatedAt: 0,
                    }
                }
            ]);
            if (response.length>0) {
                resolve(response)
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
    registerProject,
    updateProject,
    adminProjectDetail,
    adminDeleteProject,
    adminProjectStatus,
    adminProjectList


} as const;