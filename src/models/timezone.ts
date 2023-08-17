import {model, Model, Query, Schema} from "mongoose";

export interface ITimezone {
    userId: string,
    timezone: string
}

interface TimezoneModel extends Model<ITimezone> {
    findByUserId(userId:string): Query<any, any>
}

const timezoneSchema = new Schema<ITimezone,TimezoneModel>({
    userId:String,
    timezone:String
})

timezoneSchema.static('findByUserId', function findByUserId(userId:string) {
    return this.findOne({userId})
})

const MTimezone = model<ITimezone,TimezoneModel>('Timezone',timezoneSchema)

export {MTimezone}