import { useState, useEffect } from "react";

function getColor(
  score: number,
  greenTolerance: number,
  yellowTolerance: number,
  hover: boolean
): string {
  const [green, greenHover] = ["bg-green-600", "hover:bg-green-700"];
  const [yellow, yellowHover] = ["bg-amber-500", "hover:bg-amber-500"];
  const [red, redHover] = ["bg-red-600", "hover:bg-red-700"];
  const [whiteText, blackText] = ["text-white", "text-black"];

  if (score <= greenTolerance) {
    return `${whiteText} ${green} ${hover ? greenHover : ""}`;
  }

  if (score <= yellowTolerance) {
    return `${blackText} ${yellow} ${hover ? yellowHover : ""}`;
  }

  return `${whiteText} ${red} ${hover ? redHover : ""}`;
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

  useEffect(() => {
    chrome.storage.local.get(["inferenceResult"], (result) => {
      if (result.key == "inferenceResult") {
        console.log("inferenceResult:", result.inferenceResult);
        setLLMResponse(result.inferenceResult);
      }
    });
  }, []);

  return (
    <div className="w-72 m-0 p-4 flex flex-col gap-4">
      {/* Name */}
      <div className="flex items-center justify-center">
        <h1 className="font-azo-sans-uber text-3xl">Marlin</h1>
      </div>

      {/* horizontal line */}
      <div className="w-64 h-[2px] bg-black" />

      {/* Primary color indicator */}
      {LLMResponse && (
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
          <div className="flex flex-col justify-center p-2 rounded-md bg-neutral-200">
            {/* bars */}
            <div className="grid grid-flow-col justify-stretch gap-2 p-2 rounded-md">
              {LLMResponse.observations.map(
                (observation: LLMObservationType, index: number) => {
                  return (
                    <button
                      key={index}
                      className={`min-w-8 h-2 rounded-md ${getObservationSeverityColors(
                        observation,
                        true
                      )}`}
                      onClick={() => setLLMObservationIndex(index)}
                    />
                  );
                }
              )}
            </div>

            {/* Observation */}
            <div
              className={`m-2 p-2 rounded-md ${getObservationSeverityColors(
                LLMResponse.observations[LLMObservationIndex],
                false
              )}`}
            >
              <div>
                {LLMResponse.observations[LLMObservationIndex].description}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
