import { MongoClient, ObjectId } from 'mongodb';
export const getTools = async (tool_ids: any[]) => {
    let client = new MongoClient(process.env.MONGO_DB as string);
    let clientPromsie = await client.connect();
    let db = clientPromsie.db('prompt');
    let col = await db.collection('tools');
    const data = await col.find({ _id: { "$in": tool_ids.map((id: string) => new ObjectId(id)) } }).toArray();
    return data;
};

export const getWidgetByID = async (WidgetId: string) => {
    let client = new MongoClient(process.env.MONGO_DB as string);
    let clientPromsie = await client.connect();
    let db = clientPromsie.db('prompt');
    let col = await db.collection('tools');
    const data = await col.findOne({ "_id": new ObjectId(WidgetId) });
    return data;
};


export const creatAgentWithTool = async (data: any) => {
    let client = new MongoClient(process.env.MONGO_DB as string);
    let clientPromsie = await client.connect();
    let db = clientPromsie.db('prompt');
    let col = await db.collection('agent');
    const updata = await col.insertOne(data);
    return updata.insertedId;
};

export const getAgentById = async (agentId: any) => {
    let client = new MongoClient(process.env.MONGO_DB as string);
    let clientPromsie = await client.connect();
    let db = clientPromsie.db('prompt');
    let col = await db.collection('agent');
    const data = await col.findOne({ _id: new ObjectId(agentId) });
    return data;
};