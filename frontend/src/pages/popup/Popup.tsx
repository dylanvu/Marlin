import { useState } from "react";
import BarContentDiv from "./components/BarContentDiv";

export default function Popup(): JSX.Element {

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
  const [ barIndex, setBarIndex ] = useState(0);

  const updateBarContentList = (newBarContentList: BarContent[]) => {
    setBarContentList(newBarContentList);
  };

  return (
    <div className="w-80 m-0 p-4 flex flex-col gap-3">

      {/* name & bars */}
      <div className="flex items-center justify-between">
        
        {/* name */}
        <div>
          <div className="text-3xl">Marlin</div>
          <img src="" />
        </div>

        {/* bars */}
        <div className="flex gap-2">
          {
            barContentList.map((barContent: BarContent, index: number) => {
              return (
                <div
                  key={index}
                  className={`w-3 h-8 rounded-sm ${
                    barContent.color == "green"
                      ? "bg-green-700"
                      : barContent.color == "yellow"
                        ? "bg-amber-500"
                        : "bg-red-600"
                  }`}
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
