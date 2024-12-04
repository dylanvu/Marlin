import { useState, useEffect } from "react";

import { PulseLoader } from "react-spinners";

import { LLMObservationType, LLMResponseType } from "@src/global";

function getColor(
  score: number,
  greenTolerance: number,
  yellowTolerance: number,
  hover: boolean
): string {
  const colors = {
    green: {
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      text: "text-white",
    },
    yellow: {
      bg: "bg-amber-500",
      hover: "hover:bg-amber-500",
      text: "text-black",
    },
    red: {
      bg: "bg-red-600",
      hover: "hover:bg-red-700",
      text: "text-white",
    },
  };

  let colorScheme = colors.red;
  if (score <= greenTolerance) {
    colorScheme = colors.green;
  } else if (score <= yellowTolerance) {
    colorScheme = colors.yellow;
  }

  return `${colorScheme.text} ${colorScheme.bg} ${
    hover ? colorScheme.hover : ""
  }`;
}

function getPhishingScoreColors(
  LLMResponse: LLMResponseType,
  hover: boolean
): string {
  return getColor(LLMResponse.phishing_score, 1, 7, hover);
}

function getObservationSeverityColors(
  LLMObservation: LLMObservationType,
  hover: boolean
): string {
  return getColor(LLMObservation.severity, 1, 2, hover);
}

export default function Popup(): JSX.Element {
  const [LLMResponse, setLLMResponse] = useState<LLMResponseType>();
  const [LLMObservationIndex, setLLMObservationIndex] = useState(0);

  const updateInferenceResult = () => {
    chrome.storage.local.get(["inferenceResult"], (items) => {
      const inferenceResult = items.inferenceResult;
      if (inferenceResult) {
        console.log(
          "Loaded inference result from local storage in popup:",
          inferenceResult
        );
        setLLMResponse(inferenceResult);
      }
    });
  };

  useEffect(() => {
    const handleOnMessage = (message, _sender, _sendResponse) => {
      if (message.action === "receivedInference") {
        updateInferenceResult();
      }
    };

    updateInferenceResult();

    chrome.runtime.onMessage.addListener(handleOnMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleOnMessage);
    };
  }, []);

  return (
    <div className="w-72 m-0 p-4 flex flex-col gap-4">
      {/* Name */}
      <div className="flex items-center justify-center">
        <h1 className="font-azo-sans-uber text-3xl">Marlin</h1>
      </div>

      {/* Horizontal line */}
      <div className="w-64 h-px bg-black" />

      {/* Primary color indicator */}
      {LLMResponse ? (
        <>
          <div
            className={`w-64 h-24 flex items-center justify-center rounded-md ${getPhishingScoreColors(
              LLMResponse,
              false
            )}`}
          >
            <div className="text-4xl">{LLMResponse.phishing_score} / 10</div>
          </div>

          {/* Brief reason */}
          <div className="p-2 rounded-md bg-neutral-200">
            {LLMResponse.brief_reason}
          </div>

          {/* Bars + Observation */}
          <div className="flex flex-col p-2 rounded-md bg-neutral-200">
            {/* Bars */}
            {LLMResponse.observations.length > 0 && (
              <>
                <div className="grid grid-flow-col gap-2 p-2 rounded-md">
                  {LLMResponse.observations.map(
                    (observation: LLMObservationType, index: number) => (
                      <button
                        key={index}
                        className={`min-w-8 h-2 rounded-md ${getObservationSeverityColors(
                          observation,
                          true
                        )}`}
                        onClick={() => setLLMObservationIndex(index)}
                      />
                    )
                  )}
                </div>

                {/* Observation */}
                <div
                  className={`m-2 p-2 rounded-md ${getObservationSeverityColors(
                    LLMResponse.observations[LLMObservationIndex],
                    false
                  )}`}
                >
                  {LLMResponse.observations[LLMObservationIndex].description}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <PulseLoader color="#0000ff" speedMultiplier={0.5} />
        </div>
      )}
    </div>
  );
}
