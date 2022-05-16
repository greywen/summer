import { IDepartments, IUser, IUserAttendances } from "@interfaces/dingTalk";
import { ISheetTemplate } from "@interfaces/timesheet";
import * as fs from "fs";
import * as moment from "moment";

export default class FileData {
    static fileDefaultOptions: fs.WriteFileOptions = {
        encoding: "utf-8"
    }

    static async generateEmtpyAttendances(days, type = "default") {
        const users = await FileData.readUsers();
        return users.map(x => {
            return {
                id: x.id,
                dept_name: x.dept_name,
                name: x.name,
                attendances: Array.from(new Array(days), () => type === "default" ? [] : null)
            }
        });
    }

    static readAttendances = async (fileName: string): Promise<IUserAttendances[]> => {
        try {
            const data = await fs.readFileSync(`./data/${fileName}.json`, { encoding: "utf-8" });
            return <IUserAttendances[]>JSON.parse(data);
        } catch {
            const attendances = await FileData.generateEmtpyAttendances(moment(fileName).daysInMonth());
            await FileData.writeAttendances(fileName, attendances);
            return attendances;
        }
    }

    static writeAttendances = async (fileName: string, attendances: IUserAttendances[]) => {
        return await FileData.tryCatchWriteFile(`./data/${fileName}.json`, JSON.stringify(attendances));
    }

    static readCustomAttendances = async (fileName: string): Promise<IUserAttendances[]> => {
        let _fileName = fileName + "-custom";
        try {
            const data = await fs.readFileSync(`./data/${_fileName}.json`, { encoding: "utf-8" });
            return <IUserAttendances[]>JSON.parse(data);
        } catch {
            const attendances = await FileData.generateEmtpyAttendances(moment(fileName).daysInMonth(), "Custom");
            await FileData.writeCustomAttendances(fileName, attendances);
            return attendances;
        }
    }

    static writeCustomAttendances = async (fileName: string, attendances: IUserAttendances[]) => {
        let _fileName = fileName + "-custom";
        return await FileData.tryCatchWriteFile(`./data/${_fileName}.json`, JSON.stringify(attendances));
    }

    static readUsers = async () => {
        const data = await fs.readFileSync("./data/users.json", { encoding: "utf-8" });
        return <IUser[]>JSON.parse(data);
    }

    static writeUsers = async (data: string) => {
        return await FileData.tryCatchWriteFile(`./data/users.json`, data);
    }

    static readHolidays = async (year: string): Promise<string[]> => {
        const holodays = await fs.readFileSync(`./data/${year}-holiday.json`, { encoding: "utf-8" });
        return <string[]>JSON.parse(holodays);
    }

    static readDepartments = async (): Promise<IDepartments> => {
        const departments = await fs.readFileSync(`./data/departments.json`, { encoding: "utf-8" });
        return <IDepartments>JSON.parse(departments);
    }

    static writeTimeSheetTemplate = async (data: string) => {
        return await FileData.tryCatchWriteFile(`./data/timesheet-template.json`, data);
    }

    static readTimeSheetTemplate = async () => {
        const data = await fs.readFileSync(`./data/timesheet-template.json`, { encoding: "utf-8" });
        return <ISheetTemplate>JSON.parse(data);
    }

    static writeTimeSheet = async (fileName: string, data: string) => {
        const filePath = "./data/timesheets";
        const fileExist = await fs.existsSync(filePath);
        (!fileExist) && await fs.mkdirSync(filePath, { recursive: true });

        return await FileData.tryCatchWriteFile(`./data/timesheets/${fileName}.json`, data, { encoding: "utf-8" });
    }

    static async tryCatchWriteFile(file: fs.PathOrFileDescriptor, data: string, options: fs.WriteFileOptions = FileData.fileDefaultOptions) {
        try {
            await fs.writeFileSync(file, data, options);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
}
