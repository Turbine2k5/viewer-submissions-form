import {Injectable, ProviderScope} from "@tsed/di";
import * as fs from "fs";
import {PlatformMulterFile} from "@tsed/common";
import * as process from "process";

export type CustomWadEntry = {
    content: Buffer,
    filename: string
}

@Injectable({
    scope: ProviderScope.SINGLETON
})
export class CustomWadEngine {
    protected readonly basePath = `${__dirname}/../../customWads`;

    public async getWad(entryId: number): Promise<CustomWadEntry | null> {
        const files = await fs.promises.readdir(`${this.basePath}/${entryId}`);
        const content = await fs.promises.readFile(`${this.basePath}/${entryId}/${files[0]}`);
        return {
            content,
            filename: files[0]
        };
    }

    public async moveWad(entryId: number, customWad: PlatformMulterFile): Promise<void> {
        const newFolder = `${this.basePath}/${entryId}`;
        await fs.promises.mkdir(newFolder, {recursive: true});
        return fs.promises.rename(customWad.path, `${newFolder}/${customWad.originalname}`);
    }

    public async validateFile(customWad: PlatformMulterFile): Promise<boolean> {
        const allowedHeaders = process.env.ALLOWED_HEADERS;
        if (!allowedHeaders) {
            return true;
        }
        const buffer = await fs.promises.readFile(customWad.path);
        const header = buffer.toString("ascii", 0, 4);
        const allowedHeadersArr = allowedHeaders.split(",");
        return allowedHeadersArr.includes(header);
    }

    public deleteCustomWad(entry: number | PlatformMulterFile): Promise<void> {
        const toDelete = typeof entry === "number" ? `${this.basePath}/${entry}` : entry.path;
        return fs.promises.rm(toDelete, {recursive: true, force: true});
    }
}
