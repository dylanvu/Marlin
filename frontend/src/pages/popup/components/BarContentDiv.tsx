export default function BarContentDiv({
  suspiciousPortion,
  reason,
  action,
}: {
  suspiciousPortion: string;
  reason: string;
  action: string;
}) {
  return (
    <div className="h-fit flex flex-col justify-center gap-2">

      <div className="text-red-500">
        <div className="text-lg">Suspicious portion</div>
        <div>{suspiciousPortion}</div>
      </div>

      <div className="text-blue-500">
        <div className="text-lg">Reason</div>
        <div>{reason}</div>
      </div>

      <div className="text-green-500">
        <div className="text-lg">Action</div>
        <div>{action}</div>
      </div>

    </div>
  );
}
