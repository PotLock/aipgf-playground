import { ChatOpenAI } from '@langchain/openai';
import { MongoClient, ObjectId } from 'mongodb';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { DynamicTool, DynamicStructuredTool, tool } from '@langchain/core/tools';
import { z } from 'zod';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.1,
  apiKey: OPENAI_API_KEY
});

export async function executeTool({ sourceCode, account, moduleName, functions }: any) {
  const messages = [
    new SystemMessage(`You are a move developer. 
            When the user gives the source code and functions. Provide your response as a JSON object with the following schema: , 
         returns [{ name:  ${account}::${moduleName}::<function>  , description : description with module name of function 100 words limit , params : (name if params) : { type : data types params ,description about params }} `),
    new HumanMessage(
      `Your response will not be in Markdown format, only JSON.Here is the source code : ${sourceCode} , function : ${functions}  `
    )
  ];
  const parser = new StringOutputParser();
  const result = await model.invoke(messages);

  const resultParse = await parser.invoke(result);
  return resultParse;
}
export async function widgetTool({ prompt }: any) {
  const SYSTEM_TEMPLATE = new SystemMessage(`Prompt Template for React Component Assistant:

You are a React component generator assistant. Follow these instructions for all responses:

No Markdown Export:

The response format cannot be exported or interpreted as Markdown style. All text and code should be displayed as raw output, without formatting like *bold* or _italic_.
Response Structure:

All answers must follow this structure:

(props) => {
    return // component code here
}
Action Component Creation:

If the user requests to create an action, generate the corresponding component in the following style:

(props) => {
return (
    <a href={'/widget-chat?prompt=action&widgetId='+props.widgetId} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
       action
    </a>
    )
}
Response Examples:

Example 1 – Action Button Request:
Input:


Create a button with action "Submit"
Output:


(props) => {
return (
    <a href={'/widget-chat?prompt=Submit&widgetId='+props.widgetId} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Submit
    </a>
    )
}
Example 2 – Action Button with Custom Text:
Input:


Create an action button with label "Save"
Output:


(props) => {
return (
    <a href={'/widget-chat?prompt=Save&widgetId='+props.widgetId} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Save
    </a>
)

Example 3 – Label with View function:
Input:


create label show balance of address 0x12314214 with data : [{"function":"0x0000000000000000000000000000000000000000000000000000000000000001::coin::balance","functionArguments":{"owner":"0x12314214"},"typeArguments":["0x1::aptos_coin::AptosCoin"],"return":['u64'] 

Output:
(props)=>{
  const [balance, setBalance] = props.useState("");
  const load = async () => {
    const [balance] = await props.aptos.view({
      payload: {
        function: "0x1::coin::balance",
        functionArguments: [
          "0x3deb6f4432df882e2ffd8250cd9642e74a19a1720a541014850c9ea1d92d67c1",
        ],
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
      },
    });
    setBalance(balance);
  };
  props.useEffect(() => {
    load();
  }, []);
  return <p>Balance of 0x3deb6f4432df882e2ffd8250cd9642e74a19a1720a541014850c9ea1d92d67c1:{props.processData(balance)}</p>;
}
`);

  const parser = new StringOutputParser();
  const HUMAN_TEMPLATE = new HumanMessage(prompt);
  const messages = [SYSTEM_TEMPLATE, HUMAN_TEMPLATE];

  const result = await model.invoke(messages);

  const resultParse = await parser.invoke(result);
  return resultParse;
}
export async function searchTool({ prompt, tool_ids }: any) {
  const zodExtract = (type: any, describe: any) => {
    if (type == 'generic') return;
    if (type == 'u128') return z.number().describe(describe);
    if (type == 'u64') return z.number().describe(describe);
    if (type == 'u8') return z.number().describe(describe);
    if (type == 'bool') return z.boolean().describe(describe);
    if (type == 'address') return z.string().describe(describe);
    if (type == 'vector<u8>') return z.string().describe(describe);
    if (type == 'vector<address>') return z.array(z.string()).describe(describe);
    if (type == 'vector<string::String>') return z.array(z.string()).describe(describe);
    if (type == '0x1::string::String') return z.array(z.string()).describe(describe);

    return z.string().describe(describe);
  };
  let client = new MongoClient(process.env.MONGO_DB as string);
  let clientPromsie = await client.connect();
  let db = clientPromsie.db('prompt');
  let col = await db.collection('tools');
  const query = { _id: { $in: tool_ids.map((id: string) => new ObjectId(id)) } };
  let dataTools: any = await col.find(query).toArray();

  const toolMap = dataTools.map((tool: any) => {
    const ParametersSchema = Object.keys(tool.tool.params).reduce((acc: any, key: any) => {
      acc[key] = key = zodExtract(tool.tool.params[key].type, tool.tool.params[key].description);
      return acc;
    }, {});
    type ParametersData = z.infer<typeof ParametersSchema>;

    return new DynamicStructuredTool({
      name: tool._id.toString(),
      description: tool.description,
      func: async (ParametersData: ParametersData) => ``,
      schema: z.object(ParametersSchema)
    });
  });

  const systemPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a React component developer assistant assistant AI designed to help users with React component inquiries.\n 
            Analyze each query to determine if it requires plain text information or an action via a tool. Do not ever send tool call arguments with your chat. You must specifically call the tool with the information\n
            For informational queries like "create label show balance of 0x123123123", respond with text, then balance of account you answered with using the 'getBlanace'. Always say something before or after tool usage.\n
            Provide a response clearly and concisely. Always be polite, informative, and efficient.`
    ],
    ['human', '{input}']
  ]);

  const Model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    apiKey: process.env.OPENAI_API_KEY,
    streaming: false,
    verbose: false
  }).bindTools(toolMap);
  const chain = systemPrompt.pipe(Model);

  const res = await chain.invoke({ input: prompt });
  if (res.tool_calls && res.tool_calls.length > 0) {
    return (
      ' with data : ' +
      JSON.stringify(
        res.tool_calls.map((tool: any) => {
          const dataTool = dataTools.find((item: any) => item._id.toString() === tool.name);
          const res = {
            function: dataTool.tool.name,
            functionArguments: tool.args,
            typeArguments: dataTool.tool.generic_type_params,
            return: dataTool.tool.return
          };
          return res;
        })
      )
    );
  }
  return '';
}
