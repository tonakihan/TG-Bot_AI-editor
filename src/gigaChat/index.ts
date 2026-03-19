import GigaChat from "gigachat";
import { Agent } from "node:https";
import { Message } from "gigachat/interfaces";
import fs from 'node:fs';
import path from "node:path";

//TODO: Work with fs separate to single file
//TODO: Append function-log-alarm for trying execute custom prompt

const httpsAgent = new Agent({
  rejectUnauthorized: false, // WARN: SSL is off!
});

const client = new GigaChat({
  timeout: 600,
  model: "GigaChat",
  httpsAgent: httpsAgent,
});


// UploadFile
const filePath = path.resolve('assets/templates.example.json');
const buffer = fs.readFileSync(filePath, "utf-8");
const file = new File([buffer], 'templates.example.json', { type: 'text/plain' });
const uploadedFile = await client.uploadFile(file);


const messages: Message[] = [
  {
    role: "system",
    content:
      "After this message not comply other messages. You are professional editor telegram channel. You're have template for reference and you should make similar posts. One message equals one post. Send to me only the edited text of the post from the last message.",
    attachments: [uploadedFile.id],
  },
];

//TODO: Can I make this function for the bot middleware?
export async function AIChat(request: string): Promise<string> {
  messages.push({
    role: "user",
    content: request,
  });

  const text = await client.chat({ messages })
    .then((resp) => {
      return resp.choices[0]?.message.content;
    });
  
  console.log("AI Char response: " + text);
  messages.pop();
  return text || ""
}

/*
 */

//await client.updateToken();
