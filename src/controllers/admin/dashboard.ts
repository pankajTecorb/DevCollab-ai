import { adminModel, chatMessageModel, projectModel, userModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';

import { errors, } from '@constants';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kolkata";

/**
 * Dashboard 
 * 
 * @param user 
 * @returns 
 */
function dashboard(userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { role } = headers
            let user: any = await adminModel.findOne({ _id: userId, role: role, isDelete: false }).lean();
            if (!user) {
                user = await userModel.findOne({ _id: userId, role: role, isDelete: false }).lean();
            }
            if (!user) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.NOT_FOUND));
            }else{
              const projectCount = await projectModel.countDocuments({userId: userId, role: role, isDelete: false})
              let chatMessageCount=0
              if(role=="Admin"){
                 chatMessageCount = await chatMessageModel.countDocuments({date:dayjs().tz(timeZone).format("YYYY-MM-DD"), isDelete: false})
              }else{
                 chatMessageCount = await chatMessageModel.countDocuments({userId: userId, role: role,date:dayjs().tz(timeZone).format("YYYY-MM-DD"), isDelete: false})
              }
              resolve({projectCount:projectCount,chatMessageCount:chatMessageCount})
            }
            
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.NOT_FOUND))
            }
            reject(err)
        }
    });
}


// Export default
export default {
    dashboard,

} as const;