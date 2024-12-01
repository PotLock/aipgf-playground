import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z, ZodSchema, ZodTypeAny } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Item {
  tool: {
    data: string;
    accessToken: string;
  };
}

interface Tool {
  description: string;
  parameters: any;
  generate: (
    payload: any
  ) => AsyncGenerator<JSX.Element, { data: string; node: JSX.Element }, void>;
}
interface Item {
  tool: {
    data: string;
    accessToken: string;
  };
}

interface Tool {
  description: string;
  parameters: any;
  generate: (
    payload: any
  ) => AsyncGenerator<JSX.Element, { data: string; node: JSX.Element }, void>;
}
export const extractParameters = (param: any, paramZodObj: any) => {
  const paramSchema = param.schema;
  const paramName = param.name;
  const paramDesc = param.description || param.name;

  if (paramSchema.type === 'string') {
    if (param.required) {
      paramZodObj[paramName] = z
        .string({ required_error: `${paramName} required` })
        .describe(paramDesc);
    } else {
      paramZodObj[paramName] = z.string().describe(paramDesc).optional();
    }
  } else if (paramSchema.type === 'number' || paramSchema.type === 'integer') {
    if (param.required) {
      paramZodObj[paramName] = z
        .number({ required_error: `${paramName} required` })
        .describe(paramDesc);
    } else {
      paramZodObj[paramName] = z.number().describe(paramDesc).optional();
    }
  } else if (paramSchema.type === 'boolean') {
    if (param.required) {
      paramZodObj[paramName] = z
        .boolean({ required_error: `${paramName} required` })
        .describe(paramDesc);
    } else {
      paramZodObj[paramName] = z.boolean().describe(paramDesc).optional();
    }
  } else if (paramSchema.type === 'array') {
    if (param.required) {
      paramZodObj[paramName] = paramSchema.items.enum
        ? z
            .array(z.enum(paramSchema.items.enum))
            .default(paramSchema.items.default || paramSchema.items[0])
            .describe(paramDesc)
        : z.array(z.string());
    } else {
      paramZodObj[paramName] = z.boolean().describe(paramDesc).optional();
    }
  }

  return paramZodObj;
};
export const getUrl = (baseUrl: string, requestObject: any) => {
  let url = baseUrl;

  // Add PathParameters to URL if present
  if (requestObject.PathParameters) {
    for (const [key, value] of Object.entries(requestObject.PathParameters)) {
      url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
  }

  // Add QueryParameters to URL if present
  if (requestObject.QueryParameters) {
    const queryParams = new URLSearchParams(
      requestObject.QueryParameters as Record<string, string>
    );
    url += `?${queryParams.toString()}`;
  }

  return url;
};
export const jsonSchemaToZodSchema = (
  schema: any,
  requiredList: string[],
  keyName: string
): ZodSchema<any> => {
  if (schema.properties) {
    // Handle object types by recursively processing properties
    const zodShape: Record<string, ZodTypeAny> = {};
    for (const key in schema.properties) {
      zodShape[key] = jsonSchemaToZodSchema(
        schema.properties[key],
        requiredList,
        key
      );
    }
    return z.object(zodShape);
  } else if (schema.oneOf) {
    // Handle oneOf by mapping each option to a Zod schema
    const zodSchemas = schema.oneOf.map((subSchema: any) =>
      jsonSchemaToZodSchema(subSchema, requiredList, keyName)
    );
    return z.union(zodSchemas);
  } else if (schema.enum) {
    // Handle enum types
    return requiredList.includes(keyName)
      ? z.enum(schema.enum).describe(schema?.description ?? keyName)
      : z
          .enum(schema.enum)
          .describe(schema?.description ?? keyName)
          .optional();
  } else if (schema.type === 'string') {
    return requiredList.includes(keyName)
      ? z
          .string({ required_error: `${keyName} required` })
          .describe(schema?.description ?? keyName)
      : z
          .string()
          .describe(schema?.description ?? keyName)
          .optional();
  } else if (schema.type === 'array') {
    return z.array(jsonSchemaToZodSchema(schema.items, requiredList, keyName));
  } else if (schema.type === 'boolean') {
    return requiredList.includes(keyName)
      ? z
          .number({ required_error: `${keyName} required` })
          .describe(schema?.description ?? keyName)
      : z
          .number()
          .describe(schema?.description ?? keyName)
          .optional();
  } else if (schema.type === 'number') {
    return requiredList.includes(keyName)
      ? z
          .boolean({ required_error: `${keyName} required` })
          .describe(schema?.description ?? keyName)
      : z
          .boolean()
          .describe(schema?.description ?? keyName)
          .optional();
  }

  // Fallback to unknown type if unrecognized
  return z.unknown();
};

export const zodExtract = (type: any, describe: any) => {
  if (type == 'u128') return z.number().describe(describe);
  if (type == 'u64') return z.number().describe(describe);
  if (type == 'u8') return z.number().describe(describe);
  if (type == 'bool') return z.boolean().describe(describe);
  if (type == 'address') return z.string().describe(describe);
  if (type == 'vector<u8>') return z.string().describe(describe);
  if (type == 'vector<address>') return z.array(z.string()).describe(describe);
  if (type == 'vector<string::String>')
    return z.array(z.string()).describe(describe);
  if (type == 'String') return z.array(z.string()).describe(describe);
  if (type == '0x1::string::String')
    return z.array(z.string()).describe(describe);
  if (type == 'generic')
    return z.string().describe(' address type like 0x1::ABC::XYZ');
  if (type == 'Type')
    return z.string().describe(' address type like 0x1::ABC::XYZ');
  if (type == 'TypeInfo')
    return z.string().describe(' address type like 0x1::ABC::XYZ');
  return z.string().describe(describe);
};

// Function to replace placeholders in a URL template with actual values from params
export function fillUrl(template: string, params: Record<string, any>): string {
  return template.replace(/{(\w+)}/g, (_, key) => params[key] || '');
}

// Type for request options
interface ApiRequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string | FormData;
}

export const convertParamsToZod = (params: any) => {
  return Object.keys(params).reduce((acc: any, key: any) => {
    acc[key] = key = zodExtract(params[key].type, params[key].description);
    return acc;
  }, {});
};
