import { LOG_TYPES } from "../enums/logTypes";

export interface ILogBinding { 
    type: LOG_TYPES, 
    channel: string
}