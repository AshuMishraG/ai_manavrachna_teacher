// const { create } = require("zustand");

// export const teachers = ["Nanami", "Naoki"]; // Keeping the original teacher names

// export const useAITeacher = create((set, get) => ({
//    messages: [],
//    currentMessage: null,
//    teacher: teachers[0],
//    setTeacher: (teacher) => {
//       set(() => ({
//          teacher,
//          messages: get().messages.map((message) => {
//             message.audioPlayer = null; // New teacher, new Voice
//             return message;
//          }),
//       }));
//    },
//    classroom: "default",
//    setClassroom: (classroom) => {
//       set(() => ({
//          classroom,
//       }));
//    },
//    loading: false,
//    english: true, // Setting for English language only
//    setEnglish: (english) => {
//       set(() => ({
//          english,
//       }));
//    },
//    speech: "formal",
//    setSpeech: (speech) => {
//       set(() => ({
//          speech,
//       }));
//    },
//    askAI: async (question) => {
//       if (!question) {
//          return;
//       }
//       const message = {
//          question,
//          id: get().messages.length,
//       };
//       set(() => ({
//          loading: true,
//       }));

//       const speech = get().speech;

//       // Ask AI
//       const res = await fetch(`/api/ai?question=${question}&speech=${speech}`);
//       const data = await res.json();
//       message.answer = data;
//       message.speech = speech;

//       set(() => ({
//          currentMessage: message,
//       }));

//       set((state) => ({
//          messages: [...state.messages, message],
//          loading: false,
//       }));
//       get().playMessage(message);
//    },
//    playMessage: async (message) => {
//       set(() => ({
//          currentMessage: message,
//       }));

//       if (!message.audioPlayer) {
//          set(() => ({
//             loading: true,
//          }));

//          // Fetch TTS using Azure English model
//          const audioRes = await fetch(
//             `/api/tts?teacher=${get().teacher}&text=${message.answer.english}`
//          );
//          const audio = await audioRes.blob();
//          const visemes = JSON.parse(await audioRes.headers.get("visemes"));
//          const audioUrl = URL.createObjectURL(audio);
//          const audioPlayer = new Audio(audioUrl);

//          message.visemes = visemes;
//          message.audioPlayer = audioPlayer;
//          message.audioPlayer.onended = () => {
//             set(() => ({
//                currentMessage: null,
//             }));
//          };
//          set(() => ({
//             loading: false,
//             messages: get().messages.map((m) => {
//                if (m.id === message.id) {
//                   return message;
//                }
//                return m;
//             }),
//          }));
//       }

//       message.audioPlayer.currentTime = 0;
//       message.audioPlayer.play();
//    },
//    stopMessage: (message) => {
//       message.audioPlayer.pause();
//       set(() => ({
//          currentMessage: null,
//       }));
//    },
// }));

import { create } from "zustand";

export const teachers = ["Nanami", "Naoki"]; // Keeping the original teacher names

export const useAITeacher = create((set, get) => ({
   messages: [],
   currentMessage: null,
   teacher: teachers[0], // Default to the first teacher
   loading: false,
   english: true, // Setting for English language only
   speech: "formal", // Default speech type

   // Function to ask AI
   askAI: async (question) => {
      if (!question) return;

      const message = {
         question,
         id: get().messages.length,
      };

      set({ loading: true });

      // Ask AI
      const res = await fetch(
         `/api/ai?question=${encodeURIComponent(question)}`
      );
      const data = await res.json();

      if (data.error) {
         console.error("AI API Error:", data.error);
         set({ loading: false });
         return;
      }

      message.answer = data.answer; // Assign AI answer

      // Get TTS audio stream
      const audioRes = await fetch(
         `/api/tts?text=${encodeURIComponent(message.answer)}&teacher=${
            get().teacher
         }`
      );

      if (!audioRes.ok) {
         console.error("Error fetching audio:", audioRes.statusText);
         set({ loading: false });
         return;
      }

      const audioBlob = await audioRes.blob(); // Convert response to blob
      const audioUrl = URL.createObjectURL(audioBlob); // Create a URL for the blob

      // Create audio player and set it in the message
      message.audioPlayer = new Audio(audioUrl);

      set((state) => ({
         messages: [...state.messages, message],
         loading: false,
      }));

      // Play the message
      get().playMessage(message);
   },

   // Function to play a message
   playMessage: async (message) => {
      set({ currentMessage: message });

      if (!message.audioPlayer) {
         console.error("No audio player found for the message:", message);
         set({ loading: false });
         return; // Exit if no audio player
      }

      message.audioPlayer.currentTime = 0; // Reset to the beginning
      message.audioPlayer.play().catch((error) => {
         console.error("Error playing audio:", error);
         set({ loading: false });
      });

      message.audioPlayer.onended = () => {
         set({ currentMessage: null }); // Clear current message after audio ends
      };
   },

   // Function to stop a message
   stopMessage: (message) => {
      message.audioPlayer.pause();
      set({ currentMessage: null });
   },

   // Set teacher
   setTeacher: (teacher) => {
      set(() => ({
         teacher,
         messages: get().messages.map((message) => {
            message.audioPlayer = null; // New teacher, new Voice
            return message;
         }),
      }));
   },

   // Set classroom
   classroom: "default",
   setClassroom: (classroom) => {
      set(() => ({
         classroom,
      }));
   },

   // Set language preference
   setEnglish: (english) => {
      set(() => ({
         english,
      }));
   },

   // Set speech style
   setSpeech: (speech) => {
      set(() => ({
         speech,
      }));
   },
}));
