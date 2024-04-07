import { Injectable, Logger } from '@nestjs/common';
import { IBook, IWriter, IUser, IBookList, Leesstatus } from '@nx-emma-indiv/shared/api';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class Neo4Service {
    TAG = '[NeoService]';
    private logger = new Logger(Neo4Service.name);

    constructor(
        private readonly neo4jService: Neo4jService
    ) {}

    async addOrUpdateBook(book: IBook, writerId: string) {
        this.logger.log('addupdateBook');

        this.neo4jService.write(`
            MERGE (b:book {bookid: "${book._id}"})
            ON CREATE SET b.name = "${book.titel}"
            ON MATCH SET b.name = "${book.titel}"
            MERGE (w:writer {writerid: "${writerId}"})
            MERGE (b)-[:WRITTEN_BY]->(w)
        `);
    }

    async deleteBook(book: IBook) {
        this.logger.log('deleteBook');

        this.neo4jService.write(`
            MATCH (b:book {bookid: "${book._id}"})-[r]-() DELETE b, r;
        `);
    }
    

    async addOrUpdateUser(user: IUser) {
        this.logger.log('addupdateUser');

        this.neo4jService.write(`
                MERGE (u:user {userid: "${user._id}"})
                ON MATCH SET u.name = "${user.naam}"
                ON CREATE SET u.name = "${user.naam}"
        `);
    }

    async deleteUser(userId: string) {
        this.logger.log('deleteUser');

        this.neo4jService.write(`
            MATCH (u:user {userid: "${userId}"})-[r]-()
            DELETE u, r
        `);
    }
    
    async addOrUpdateWriter(writer: IWriter) {
        this.logger.log('addupdateWriter');

        this.neo4jService.write(`
            MERGE (w:writer {writerid: "${writer._id}"})
            ON CREATE SET w.name = "${writer.schrijvernaam}"
            ON MATCH SET w.name = "${writer.schrijvernaam}"
        `);
    }
    

    async deleteWriter(writerId: string) {
        this.logger.log('deleteWriter');
    
        this.neo4jService.write(`
            MATCH (w:writer {writerid: "${writerId}"})
            OPTIONAL MATCH (w)<-[r:WRITTEN_BY]-(b:book)
            OPTIONAL MATCH (b)-[r1:READ|TO_READ|DNF]-()
            DELETE w, b, r, r1
        `);
    }
    

    async addBookList(userId: string, bookId: IBook, leesstatus: Leesstatus) {
        this.logger.log('addOrUpdateBookList');
    
        this.neo4jService.write(`
            MATCH (u:user {userid: "${userId}"})
            MATCH (b:book {bookid: "${bookId}"})
            MERGE (u)-[r:${leesstatus}]->(b)
            ON CREATE SET r.readingstatus = "${leesstatus}"
        `);
    }

    async updateBookList(userId: string, bookId: IBook, leesstatus: Leesstatus) {
        this.logger.log('updateBookUserRelation');
    
        this.neo4jService.write(`
            MATCH (u:user {userid: "${userId}"})-[r]->(b:book {bookid: "${bookId}"})
            DELETE r
            MERGE (u)-[:${leesstatus}]->(b)
        `);
    }
    
    async removeBookBookList(userId: string, bookId: IBook) {
        this.logger.log('removeBookBookList');
        
        this.neo4jService.write(`
            MATCH (u:user {userid: "${userId}"})-[r:READ|TO_READ|DNF]->(b:book {bookid: "${bookId}"})
            DELETE r
        `);
    }


    async findRecommendationsBook(boekId: string): Promise<IBook[]> {
        this.logger.log('findRecommendationsBook');

        console.log("boekId" + boekId)
    
        const query = `
            MATCH (b:book {bookid: "${boekId}"})<-[:READ]-(u:user)-[:READ]->(recommended:book)
            WHERE recommended <> b
            WITH recommended, COUNT(u) AS userCount
            RETURN recommended, userCount
            ORDER BY userCount DESC
            LIMIT 5
        `;
        
        const results = await this.neo4jService.read(query);
        
        const recommendedBooks: IBook[] = results.records.map(record => {
        
            const recommendedNode = record.get('recommended');
    
            const book: Partial<IBook> = {
                titel: recommendedNode.properties.name,
                _id: recommendedNode.properties.bookid,
            };
    
            return book as IBook;
    
        });
    
    
        return recommendedBooks;
    }
        
}