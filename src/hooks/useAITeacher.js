// const { create } = require("zustand");

// export const teachers = ["Nanami", "Naoki"];

// export const useAITeacher = create((set, get) => ({
//   messages: [],
//   currentMessage: null,
//   teacher: teachers[0],
//   setTeacher: (teacher) => {
//     set(() => ({
//       teacher,
//       messages: get().messages.map((message) => {
//         message.audioPlayer = null; // New teacher, new Voice
//         return message;
//       }),
//     }));
//   },
//   classroom: "default",
//   setClassroom: (classroom) => {
//     set(() => ({
//       classroom,
//     }));
//   },
//   loading: false,
//   furigana: true,
//   setFurigana: (furigana) => {
//     set(() => ({
//       furigana,
//     }));
//   },
//   english: true,
//   setEnglish: (english) => {
//     set(() => ({
//       english,
//     }));
//   },
//   speech: "formal",
//   setSpeech: (speech) => {
//     set(() => ({
//       speech,
//     }));
//   },
//   askAI: async (question) => {
//     if (!question) {
//       return;
//     }
//     const message = {
//       question,
//       id: get().messages.length,
//     };
//     set(() => ({
//       loading: true,
//     }));

//     const speech = get().speech;

//     // Ask AI
//     const res = await fetch(`/api/ai?question=${question}&speech=${speech}`);
//     const data = await res.json();
//     message.answer = data;
//     message.speech = speech;

//     set(() => ({
//       currentMessage: message,
//     }));

//     set((state) => ({
//       messages: [...state.messages, message],
//       loading: false,
//     }));
//     get().playMessage(message);
//   },
//   playMessage: async (message) => {
//     set(() => ({
//       currentMessage: message,
//     }));

//     if (!message.audioPlayer) {
//       set(() => ({
//         loading: true,
//       }));
//       // Get TTS
//       const audioRes = await fetch(
//         `/api/tts?teacher=${get().teacher}&text=${message.answer.japanese
//           .map((word) => word.word)
//           .join(" ")}`
//       );
//       const audio = await audioRes.blob();
//       const visemes = JSON.parse(await audioRes.headers.get("visemes"));
//       const audioUrl = URL.createObjectURL(audio);
//       const audioPlayer = new Audio(audioUrl);

//       message.visemes = visemes;
//       message.audioPlayer = audioPlayer;
//       message.audioPlayer.onended = () => {
//         set(() => ({
//           currentMessage: null,
//         }));
//       };
//       set(() => ({
//         loading: false,
//         messages: get().messages.map((m) => {
//           if (m.id === message.id) {
//             return message;
//           }
//           return m;
//         }),
//       }));
//     }

//     message.audioPlayer.currentTime = 0;
//     message.audioPlayer.play();
//   },
//   stopMessage: (message) => {
//     message.audioPlayer.pause();
//     set(() => ({
//       currentMessage: null,
//     }));
//   },
// }));

import { create } from "zustand";

// Define relevant teachers for the context of the application
export const teachers = ["Nanami", "Naoki"]; // Keeping teacher names relevant

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0], // Set the default teacher
  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => {
        message.audioPlayer = null; // New teacher, new voice
        return message;
      }),
    }));
  },
  classroom: "default",
  setClassroom: (classroom) => {
    set(() => ({
      classroom,
    }));
  },
  loading: false,
  english: true,
  setEnglish: (english) => {
    set(() => ({
      english,
    }));
  },
  speech: "formal",
  setSpeech: (speech) => {
    set(() => ({
      speech,
    }));
  },
  askAI: async (question) => {
    if (!question) return; // Prevent empty questions

    const message = {
      question,
      id: get().messages.length,
    };

    set(() => ({ loading: true }));

    try {
      // Ask AI for information
      const res = await fetch(`/api/ai?question=${encodeURIComponent(question)}`);

      if (!res.ok) {
        console.error("Failed to fetch from AI:", await res.text());
        set({ loading: false });
        return; // Handle API failure
      }

      const data = await res.json();
      message.answer = data.message || { english: "" }; // Ensure message has a valid answer structure
      message.speech = get().speech;

      set(() => ({
        currentMessage: message,
        messages: [...get().messages, message],
        loading: false,
      }));

      get().playMessage(message); // Attempt to play the message immediately after
    } catch (error) {
      console.error("Error during asking AI:", error);
      set({ loading: false });
    }
  },
  playMessage: async (message) => {
    set(() => ({
      currentMessage: message,
    }));

    if (!message.audioPlayer) {
      set(() => ({ loading: true }));

      // Ensure message.answer has an English property for TTS request
      if (message.answer && message.answer.english) {
        const audioRes = await fetch(`/api/tts?text=${encodeURIComponent(message.answer.english)}`);

        if (!audioRes.ok) {
          console.error("Failed to fetch audio from TTS");
          set(() => ({ loading: false }));
          return; // Handle potential errors accordingly
        }

        const audioData = await audioRes.json();

        // Ensure audio URL is fetched correctly
        if (audioData.audioUrl) {
          const audioBlob = await fetch(audioData.audioUrl); // Fetch audio Blob
          const audio = await audioBlob.blob();
          const audioUrl = URL.createObjectURL(audio);
          const audioPlayer = new Audio(audioUrl);

          message.audioPlayer = audioPlayer;

          message.audioPlayer.onended = () => {
            set(() => ({
              currentMessage: null,
            }));
          };

          set(() => ({
            loading: false,
            messages: get().messages.map((m) => {
              return m.id === message.id ? message : m;
            }),
          }));
        } else {
          console.error("No audio URL returned");
          set(() => ({ loading: false }));
        }
      } else {
        console.error("Message answer or English structure is invalid");
        set(() => ({ loading: false }));
      }
    }

    // Ensure audio is played
    if (message.audioPlayer) {
      message.audioPlayer.currentTime = 0; // Reset the current time
      message.audioPlayer.play(); // Play the audio
    }
  },
  stopMessage: (message) => {
    if (message.audioPlayer) {
      message.audioPlayer.pause();
      set(() => ({
        currentMessage: null,
      }));
    }
  },
}));
