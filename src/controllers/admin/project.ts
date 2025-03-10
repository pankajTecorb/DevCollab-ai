import { projectModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors, } from '@constants';
import { randomString } from '@utils/helpers';
import { findOne } from '@models/admin';


/**
 *  Registor Project
 * 
 * @param user 
 * @returns 
 */
function registerProject(body: any, userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const names = body.name.trim()
            const projectData = await projectModel.findOne({ name: names, role: body.name, userId: userId })
            if (projectData) {
                reject(new CustomError((errors.en.projectExist.replace('{{name}}', body.name)), StatusCodes.BAD_REQUEST))
            } else {
                body.userId = userId
                body.name = names
                body.role = body.role
                body.projectId = randomString(8, 'A#')
                const response: any = await projectModel.create(body)
                resolve(response)
            }
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
 *  Update Project
 * 
 * @param body 
 * @returns 
 */

function updateProject(body: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const proData: any = await projectModel.findOne({ _id: userId })
            if (proData) {
                const updateData = await projectModel.updateOne({ _id: proData._id }, body)
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
 * Project Details 
 * 
 * @param body 
 * @returns 
 */
function adminProjectDetail(userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const proData: any = await projectModel.findOne({ _id: userId }).lean()
            if (proData) {
                resolve(proData)
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
 *  Delete Project 
 * 
 * @param body 
 * @returns 
 */

function adminDeleteProject(projectId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const proData: any = await projectModel.findOne({ _id: projectId })
            if (proData) {
                const updateData = await projectModel.updateOne({ _id: proData._id }, { isDelete: true }, { new: true })
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
 * Project Status Change
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
                const proData: any = await projectModel.findOne({ _id: userId })
                if (proData) {
                    const updateData = await projectModel.updateOne({ _id: proData._id }, { isActive: body.isActive }, { new: true })
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
 * Project List 
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
                userId: userId

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
            const total = await projectModel.aggregate([
                { $match: condition },
                {
                    $project: {
                        _id: 1,
                    }
                }
            ]);
            if (response.length > 0) {
                resolve({ response, Total: total.length })
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