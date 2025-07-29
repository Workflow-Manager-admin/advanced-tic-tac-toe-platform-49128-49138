import ChatBox from "@/components/ChatBox";
import HistoryPanel from "@/components/HistoryPanel";

export default function SidePanel() {
  return (
    <div className="flex flex-col h-full min-h-[32rem]">
      <div className="flex-1 border-b">
        <HistoryPanel />
      </div>
      <ChatBox />
    </div>
  );
}
