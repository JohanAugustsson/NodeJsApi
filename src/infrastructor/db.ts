import { MongoClient, Db } from 'mongodb';

class MongoConnection {
    private mongoClient: MongoClient | null;
    private readonly mongoURI: string;
    public db: Db | null = null;

    constructor() {
        this.mongoClient = null;
        this.mongoURI = 'mongodb://localhost:27017/pokemon';
        // this.mongoURI = 'mongodb://root:password@host:27017';
    }

    async connect(): Promise<MongoConnection> {
        try {
            if (!this.mongoClient) {
                this.mongoClient = new MongoClient(this.mongoURI, {
                    // useNewUrlParser: true,
                    // useUnifiedTopology: true,
                });

                await this.mongoClient.connect();
                console.log('Connected to MongoDB');
            }

            this.db = this.mongoClient.db();
            return this
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            throw err;
        }
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

// Export singleton instance of MongoConnection
export const mongoConnection = new MongoConnection();
