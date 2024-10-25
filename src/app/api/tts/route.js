// import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import { PassThrough } from "stream";

// export async function GET(req) {
//   // WARNING: Do not expose your keys
//   // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of Azure resources

//   const speechConfig = sdk.SpeechConfig.fromSubscription(
//     process.env["SPEECH_KEY"],
//     process.env["SPEECH_REGION"]
//   );

//   // https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
//   const teacher = req.nextUrl.searchParams.get("teacher") || "Nanami";
//   speechConfig.speechSynthesisVoiceName = `ja-JP-${teacher}Neural`;

//   const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
//   const visemes = [];
//   speechSynthesizer.visemeReceived = function (s, e) {
//     // console.log(
//     //   "(Viseme), Audio offset: " +
//     //     e.audioOffset / 10000 +
//     //     "ms. Viseme ID: " +
//     //     e.visemeId
//     // );
//     visemes.push([e.audioOffset / 10000, e.visemeId]);
//   };
//   const audioStream = await new Promise((resolve, reject) => {
//     speechSynthesizer.speakTextAsync(
//       req.nextUrl.searchParams.get("text") ||
//         "I'm excited to try text to speech",
//       (result) => {
//         const { audioData } = result;

//         speechSynthesizer.close();

//         // convert arrayBuffer to stream
//         const bufferStream = new PassThrough();
//         bufferStream.end(Buffer.from(audioData));
//         resolve(bufferStream);
//       },
//       (error) => {
//         console.log(error);
//         speechSynthesizer.close();
//         reject(error);
//       }
//     );
//   });
//   const response = new Response(audioStream, {
//     headers: {
//       "Content-Type": "audio/mpeg",
//       "Content-Disposition": `inline; filename=tts.mp3`,
//       Visemes: JSON.stringify(visemes),
//     },
//   });
//   // audioStream.pipe(response);
//   return response;
// }

import fetch from "node-fetch";
import { PassThrough } from "stream";

export async function GET(req) {
   // WARNING: Do not expose your keys
   // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of Google Cloud resources

   const userQuestion =
      req.nextUrl.searchParams.get("question") ||
      "Can you provide information about the courses offered?";

   // Generating a response based on the user's question
   const responseText = await generateResponse(userQuestion);

   // Prepare the TTS request
   const requestBody = {
      input: { text: responseText },
      voice: { languageCode: "en-US", name: "en-US-Wavenet-D" }, // Choose an appropriate English voice
      audioConfig: { audioEncoding: "MP3" },
   };

   const apiKey = process.env.GOOGLE_TTS_API_KEY;

   try {
      // Call Google TTS to synthesize speech
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
         // Log the error response and throw an error
         const errorDetails = await response.text();
         console.error("Failed to synthesize speech:", errorDetails);
         throw new Error("Failed to synthesize speech");
      }

      const audioContent = await response.json();

      // Convert audio content to a stream
      const audioStream = new PassThrough();
      audioStream.end(Buffer.from(audioContent.audioContent, "base64")); // Process audioContent to stream

      // Set the response headers
      const responseHeaders = {
         "Content-Type": "audio/mpeg",
         "Content-Disposition": `inline; filename=tts.mp3`,
      };

      // Return the audio stream as a response
      const responseObj = new Response(audioStream, {
         headers: responseHeaders,
      });

      return responseObj;

   } catch (error) {
      console.error("Error occurred while fetching audio from TTS:", error);
      return new Response("An error occurred while generating the speech.", { status: 500 });
   }
}

// Function to illustrate response generation logic
async function generateResponse(question) {
   // Simple example of dynamic response generation based on the user's question
   switch (question.toLowerCase()) {
      case "what courses are offered?":
         return "Manav Rachna University offers a wide variety of courses in Engineering, Management, and Arts. Would you like to know more about a specific course?";
      case "what is the admission process?":
         return "The admission process includes filling out an application form, submitting required documents, and attending an interview. For more details, please visit our admissions page.";
      case "what are the fees?":
         return "The fee structure varies by course. Please refer to the university's official website for the most accurate and up-to-date information.";
      default:
         return "I'm here to help! Could you please specify what information you are looking for regarding Manav Rachna University?";
   }
}
