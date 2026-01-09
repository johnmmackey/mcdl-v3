import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

// Create low-level client
const ddbClient = new DynamoDBClient({
  //region: "us-east-1", // or process.env.AWS_REGION
});

// Create document client (handles marshalling)
const docClient = DynamoDBDocumentClient.from(ddbClient);

export interface EventRecord {
  eventType: string;
  eventSubType: string;
  timestamp?: number;
    text: string;
}

export async function logEvent(record: EventRecord): Promise<void> {
  const command = new PutCommand({
    TableName: "MCDL-EventTable-DEV",
    Item: {
        ...record,
        timestamp: Date.now(),
    }
  });

  await docClient.send(command);
}
