// import { useAITeacher } from "@/hooks/useAITeacher";
// import { useState } from "react";

// export const TypingBox = () => {
//   const askAI = useAITeacher((state) => state.askAI);
//   const loading = useAITeacher((state) => state.loading);
//   const [question, setQuestion] = useState("");

//   const ask = () => {
//     askAI(question);
//     setQuestion("");
//   };
//   return (
//     <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
//       <div>
//         <h2 className="text-white font-bold text-xl">
//           How to say in Japanese?
//         </h2>
//         <p className="text-white/65">
//           Type a sentence you want to say in Japanese and AI Sensei will
//           translate it for you.
//         </p>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center">
//           <span className="relative flex h-4 w-4">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
//           </span>
//         </div>
//       ) : (
//         <div className="gap-3 flex">
//           <input
//             className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
//             placeholder="Have you ever been to Japan?"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 ask();
//               }
//             }}
//           />
//           <button
//             className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
//             onClick={ask}
//           >
//             Ask
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// import { useAITeacher } from "@/hooks/useAITeacher";
// import { useState } from "react";

// export const TypingBox = () => {
//   const askAI = useAITeacher((state) => state.askAI);
//   const loading = useAITeacher((state) => state.loading);
//   const [question, setQuestion] = useState("");

//   const ask = () => {
//     if (question.trim()) { // Prevent asking empty questions
//       askAI(question);
//       setQuestion("");
//     }
//   };

//   return (
//     <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
//       <div>
//         <h2 className="text-white font-bold text-xl">
//           Ask the AI Assistant
//         </h2>
//         <p className="text-white/65">
//           Type a question about courses or admissions at Manav Rachna University, and the AI will respond.
//         </p>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center">
//           <span className="relative flex h-4 w-4">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
//           </span>
//         </div>
//       ) : (
//         <div className="gap-3 flex">
//           <input
//             className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
//             placeholder="What courses are offered?"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 ask();
//               }
//             }}
//           />
//           <button
//             className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
//             onClick={ask}
//           >
//             Ask
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

import { useAITeacher } from "@/hooks/useAITeacher"; // Assumes useAITeacher hook is defined as per previous context
import { useState } from "react";

export const TypingBox = () => {
  const askAI = useAITeacher((state) => state.askAI); // Accessing askAI method from the store
  const loading = useAITeacher((state) => state.loading); // Accessing loading state
  const [question, setQuestion] = useState(""); // State for the input question

  const ask = async () => {
    if (question.trim()) { // Prevent asking empty questions
      try {
        const response = await askAI(question); // Await the API call
        
        // Implement additional logic if needed to handle the API response
        console.log("Response from AI:", response); // Log the response for debug purposes
        
        setQuestion(""); // Clear input after processing the question
      } catch (error) {
        console.error("Error while asking AI:", error);
        // Optionally, show an error message to the user here
      }
    }
  };

  return (
    <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">Ask the AI Assistant</h2>
        <p className="text-white/65">
          Type a question about courses or admissions at Manav Rachna University, and the AI will respond.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex">
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="What courses are offered?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)} // Update input value
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ask(); // Trigger ask function on Enter key press
              }
            }}
          />
          <button
            className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
            onClick={ask} // Trigger ask function on button click
          >
            Ask
          </button>
        </div>
      )}
    </div>
  );
};

