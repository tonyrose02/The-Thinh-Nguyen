import { getFunctions, httpsCallable } from "firebase/functions";
import { chrisAIInstructions } from '../constants/AIconstants';
// import { ConstructionOutlined } from '@mui/icons-material';

const callFn = async (fn: string, args: unknown) => {
  const functions = getFunctions();
  const callFn = httpsCallable(functions, fn);
  const result = await callFn(args);
  return result.data;
};

const getGeminiKey = async () => {
  try {
    const key = await callFn('gemini-getGeminiApiKey', {});
    return key;
  }
  catch (e) {
    console.error(e);
    return null;
  }
}

// Define the function that will be called when the model is invoked
const generateResponse = async (genAI: { getGenerativeModel: (arg0: { model: string; systemInstruction: string; }) => any; }, userPrompt: string, userName: string, chatHistory: any[], comedySetting: any, uid: any) => {
  // Set the system instruction during model initialization
  const researchModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: chrisAIInstructions,
  });
  let history: any[] = [];
  try {
    let prompt = userPrompt.toLowerCase();
    const firstName = userName.split(' ')[0];
    prompt += `\n\n User name: ${firstName}`;
    prompt += `\n\n Comedy setting: ${comedySetting}`;
    prompt += `\n\n User ID: ${uid}`;

    if (chatHistory && chatHistory.length > 0) {
      history = chatHistory.map((chat) => {
        if (!chat.firstModelMessage) {
          return {
            role: chat.sender === 'chris' ? 'model' : 'user',
            parts: [{ text: chat.text }],
          };
        } else {
          return null;
        }
      });
      history = history.filter(cell => cell !== null);
    }
    

    const chat = researchModel.startChat({
      history: history,
    });

    const result = await chat.sendMessage(prompt);

    return result.response.candidates[0].content.parts[0].text;
  } catch (e) {
    console.error(e);
    return "I'm sorry, I'm having trouble understanding you right now. Please try again later. (If you continue to have trouble, please email chris@facultyofskin.com or refreshing the page)";
  }
};

export { generateResponse, getGeminiKey };

