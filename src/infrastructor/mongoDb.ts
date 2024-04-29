import {singleton} from "tsyringe";
import {Collection, Db, MongoClient} from "mongodb";


export interface IMongoDb {
    getCollection(name: string): Promise<Collection<any> | undefined>;
}


@singleton()
export class MongoDb implements IMongoDb {
    private readonly mongoURI: string = 'mongodb://mongoDb:27017/pokemon'
    private mongoClient: MongoClient | null = null
    private db: Db | null = null;

    constructor() {
        this.connect().then(/*Do nothing*/)
    }

    private async connect(): Promise<Db> {
        try {
            this.mongoClient = await new MongoClient(this.mongoURI).connect();

            this.db = this.mongoClient.db('pokemon')
            console.log('Connected to MongoDB');
            return this.db;

        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            throw err;
        }
    }

    async getCollection(name: string): Promise<Collection<any> | undefined>{
        if (!this.db){
            const db = await this.connect()
            return db.collection(name);
        }
        return this.db.collection(name)
    }

    async close(): Promise<void> {
        try {
            if (this.mongoClient) {
                await this.mongoClient.close();
                console.log('MongoDB connection closed');
            }
        } catch (err) {
            console.error('Error closing MongoDB connection:', err);
        }
    }

}