import { useState } from "react";
import Markdown from "react-markdown";
import "./App.css";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.APIKEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
function App() {
  let [inputData, setInputData] = useState("");
  let [returnData, setReturnData] = useState([]);

  async function run(data) {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(data);
    setReturnData([
      ...returnData,
      { sender: "user", text: data },
      { sender: "bot", text: result.response.text() },
    ]);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-[80vh] p-4 flex flex-col overflow-y-auto text-white">
        {returnData.map((message, index) =>
          message.sender === "user" ? (
            <div className="flex gap-3 float-right justify-end" key={index}>
              
              <div
                key={index}
                className={`my-2 px-6 py-4 text-left w-fit rounded-2xl float-left ${
                  message.sender === "user"
                    ? "bg-[#2F2F2F] self-end"
                    : "bg-gray-700 self-end"
                }`}>
                <Markdown>{message.text}</Markdown>
              </div>
              {/* <div className="my-2  p-4 aspect-square text-left rounded-full float-left bg-gray-700 self-end">
                AJ
              </div> */}
            </div>
          ) : (
              <div className="flex gap-3" key={index}>
                <div className="my-2 p-4 aspect-square text-left w-fit rounded-full float-right bg-gray-700 self-start">
                  Bot
                </div>
                <div
                  key={index}
                  className={`my-2 px-6 py-4 text-left  w-fit rounded-2xl float-left ${
                    message.sender === "user"
                      ? "bg-gray-700 self-end"
                      : "bg-[#2F2F2F] self-start"
                  }`}>
                  <Markdown>{message.text}</Markdown>
                </div>
              </div>
          )
        )}
      </div>
      <div className="py-2 px-2 rounded-full bg-gray-700 flex items-center">
        <input
          type="text"
          onChange={(e) => setInputData(e.target.value)}
          value={inputData}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Let's chat..."
          required
        />

        <button
          onClick={() => {
            run(inputData);
            setInputData("");
          }}
          type="submit"
          class="inline-flex items-center py-2.5 px-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg
            class="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
