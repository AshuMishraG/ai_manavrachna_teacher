// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
// });

// const formalExample = {
//   japanese: [
//     { word: "日本", reading: "にほん" },
//     { word: "に" },
//     { word: "住んで", reading: "すんで" },
//     { word: "います" },
//     { word: "か" },
//     { word: "?" },
//   ],
//   grammarBreakdown: [
//     {
//       english: "Do you live in Japan?",
//       japanese: [
//         { word: "日本", reading: "にほん" },
//         { word: "に" },
//         { word: "住んで", reading: "すんで" },
//         { word: "います" },
//         { word: "か" },
//         { word: "?" },
//       ],
//       chunks: [
//         {
//           japanese: [{ word: "日本", reading: "にほん" }],
//           meaning: "Japan",
//           grammar: "Noun",
//         },
//         {
//           japanese: [{ word: "に" }],
//           meaning: "in",
//           grammar: "Particle",
//         },
//         {
//           japanese: [{ word: "住んで", reading: "すんで" }, { word: "います" }],
//           meaning: "live",
//           grammar: "Verb + て form + います",
//         },
//         {
//           japanese: [{ word: "か" }],
//           meaning: "question",
//           grammar: "Particle",
//         },
//         {
//           japanese: [{ word: "?" }],
//           meaning: "question",
//           grammar: "Punctuation",
//         },
//       ],
//     },
//   ],
// };

// const casualExample = {
//   japanese: [
//     { word: "日本", reading: "にほん" },
//     { word: "に" },
//     { word: "住んで", reading: "すんで" },
//     { word: "いる" },
//     { word: "の" },
//     { word: "?" },
//   ],
//   grammarBreakdown: [
//     {
//       english: "Do you live in Japan?",
//       japanese: [
//         { word: "日本", reading: "にほん" },
//         { word: "に" },
//         { word: "住んで", reading: "すんで" },
//         { word: "いる" },
//         { word: "の" },
//         { word: "?" },
//       ],
//       chunks: [
//         {
//           japanese: [{ word: "日本", reading: "にほん" }],
//           meaning: "Japan",
//           grammar: "Noun",
//         },
//         {
//           japanese: [{ word: "に" }],
//           meaning: "in",
//           grammar: "Particle",
//         },
//         {
//           japanese: [{ word: "住んで", reading: "すんで" }, { word: "いる" }],
//           meaning: "live",
//           grammar: "Verb + て form + いる",
//         },
//         {
//           japanese: [{ word: "の" }],
//           meaning: "question",
//           grammar: "Particle",
//         },
//         {
//           japanese: [{ word: "?" }],
//           meaning: "question",
//           grammar: "Punctuation",
//         },
//       ],
//     },
//   ],
// };

// export async function GET(req) {
//   // WARNING: Do not expose your keys
//   // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

//   const speech = req.nextUrl.searchParams.get("speech") || "formal";
//   const speechExample = speech === "formal" ? formalExample : casualExample;

//   const chatCompletion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: `You are a Japanese language teacher.
// Your student asks you how to say something from english to japanese.
// You should respond with:
// - english: the english version ex: "Do you live in Japan?"
// - japanese: the japanese translation in split into words ex: ${JSON.stringify(
//           speechExample.japanese
//         )}
// - grammarBreakdown: an explanation of the grammar structure per sentence ex: ${JSON.stringify(
//           speechExample.grammarBreakdown
//         )}
// `,
//       },
//       {
//         role: "system",
//         content: `You always respond with a JSON object with the following format:
//         {
//           "english": "",
//           "japanese": [{
//             "word": "",
//             "reading": ""
//           }],
//           "grammarBreakdown": [{
//             "english": "",
//             "japanese": [{
//               "word": "",
//               "reading": ""
//             }],
//             "chunks": [{
//               "japanese": [{
//                 "word": "",
//                 "reading": ""
//               }],
//               "meaning": "",
//               "grammar": ""
//             }]
//           }]
//         }`,
//       },
//       {
//         role: "user",
//         content: `How to say ${
//           req.nextUrl.searchParams.get("question") ||
//           "Have you ever been to Japan?"
//         } in Japanese in ${speech} speech?`,
//       },
//     ],
//     // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
//     model: "gpt-3.5-turbo", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
//     response_format: {
//       type: "json_object",
//     },
//   });
//   console.log(chatCompletion.choices[0].message.content);
//   return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
// }

import OpenAI from "openai";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
   apiKey: process.env["OPENAI_API_KEY"],
});

// Optional function to handle file searches or document integrations
async function searchFiles(query) {
   // Placeholder implementation for searching documents
   return `Searching for information related to: ${query}`;
}

export async function GET(req) {
   // WARNING: Do not expose your keys
   // WARNING: If you host this project publicly, consider adding an authentication layer to limit API consumption.

   const userQuestion = req.nextUrl.searchParams.get("question") || "Can you help me with the courses?";

   try {
      const chatCompletion = await openai.chat.completions.create({
         messages: [
            {
               role: "system",
               content: `You are an AI assistant dedicated to helping parents and students explore the courses offered at Manav Rachna Institutions. Your task is to guide them through the process of selecting courses, understanding eligibility, and providing details on fees, admission, and campus visits. Tone: Polite, conversational, and friendly. Keep responses concise and relevant, answering only what’s asked based on prior responses. Throughout the conversation, ensure responses are tailored to the visitor’s needs.`,
            },
            {
               role: "user",
               content: userQuestion,
            },
         ],
         model: "gpt-4o", // Ensure you are using the correct model name
      });

      const responseContent = chatCompletion.choices[0].message.content;

      // Example: If file search integration is needed
      const searchResult = await searchFiles(userQuestion); // Uncomment if you implement file search logic

      // Formulate the final response
      const finalResponse = {
         message: responseContent,
         // searchInfo: searchResult, // If included, it should be merged properly
      };

      return Response.json(finalResponse);
   } catch (error) {
      console.error("Error during OpenAI request:", error);
      return Response.json({ error: "An error occurred while processing your request." }, { status: 500 });
   }
}
