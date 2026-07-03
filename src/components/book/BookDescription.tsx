export const BookDescription = ({ text }: { text: string }) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-bold">Description</h2>
    <p className="text-[#0A0D12] leading-7">{text}</p>
  </div>
);