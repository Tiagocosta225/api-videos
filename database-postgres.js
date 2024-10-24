import { randomUUID } from "node:crypto"
import { sql } from './sql.js'

export class DatabasePostgres {
    async list(search)  {
        let videos

        if (search) {
            videos = await sql `select * from videos where title ilike ${'%' + search + '%'}`
        } else {
            videos = await sql `select * from videos`
        }

        return videos

    }

    async create(video) {
        const videoId = randomUUID()
        const { title, description, duartion } = video

        await sql `insert into videos (id, title, description, duration) VALUES (${videoId}, ${title}, ${description}, ${duartion})`
    }

    async update(videoId, video) {
        const { title, description, duartion } = video

        await sql`update videos set title = ${title}, description = ${description}, duration = ${duartion} WHERE id = ${videoId}`
       
    }

    async delete(videoId, video) {
        await sql `delete from videos where id = ${videoId}`
    
    }
}