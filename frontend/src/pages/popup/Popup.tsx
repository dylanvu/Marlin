import { useState } from "react";
import BarContentDiv from "./components/BarContentDiv";

function getBarColor(barColor: barColor): string {
  switch (barColor) {
    case "green": return "bg-green-600 hover:bg-green-800";
    case "yellow": return "bg-amber-400 hover:bg-amber-600";
    case "red": return "bg-red-600 hover:bg-red-800";
  }
}

export default function Popup(): JSX.Element {

  const [ barIndex, setBarIndex ] = useState(0);
  const [ barContentList, setBarContentList ] = useState<BarContent[]>([
    {
      suspiciousPortion: "iwanttoscamyou@scamcentral.com",
      reason: "This email is clearly sus (:",
      action: "Exit this email immediately and report the email to your supervisor or IT department.",
      color: "red"
    }, {
      suspiciousPortion: "support@goegle.com",
      reason: "Seems suspicious at level 6 because it may be trying to confuser users with google.com.",
      action: "Look into this domain, and make sure it is truly somebody you would receive an email from.",
      color: "yellow"
    }, {
      suspiciousPortion: "support@google.com",
      reason: "Nothing looks out of place. The email address, subject line, and content aren't suspicious.",
      action: "No action necessary.",
      color: "green"
    },
  ]);

  const updateBarContentList = (newBarContentList: BarContent[]) => {
    setBarContentList(newBarContentList);
  };

  return (
    <div className="w-80 m-0 p-4 flex flex-col gap-3">

      {/* name & bars */}
      <div className="flex items-center justify-between">
        
        {/* name */}
        <div className="flex gap-2 py-3 px-4 rounded-sm bg-neutral-200">
          <div className="text-3xl">Marlin</div>
          {/* <img src="" /> */}
        </div>

        {/* bars */}
        <div className="flex gap-2 p-3 rounded-sm bg-neutral-200">
          {
            barContentList.map((barContent: BarContent, index: number) => {
              return (
                <div
                  key={index}
                  className={`w-3 h-8 rounded-sm ${getBarColor(barContent.color)}`}
                  onClick={() => setBarIndex(index)}
                />
              );
            })
          }
        </div>

      </div>

      {/* horizontal line */}
      <div className="w-72 h-[2px] bg-black" />
      
      {/* text */}
      <BarContentDiv
        suspiciousPortion={barContentList[barIndex]?.suspiciousPortion}
        reason={barContentList[barIndex]?.reason}
        action={barContentList[barIndex]?.action}
      />

    </div>
  );
}
