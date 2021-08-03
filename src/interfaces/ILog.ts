import { LOG_TYPES } from "../enums/logTypes";

export interface ILog {
    msg: string; 
    type: LOG_TYPES;
    timestamp?: number;
}