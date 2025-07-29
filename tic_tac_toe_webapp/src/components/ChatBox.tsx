export default function ChatBox() {
  return (
    <div className="bg-gray-100 px-3 py-2 flex flex-col h-36">
      <div className="text-xs text-dark font-semibold mb-1">Chat (coming soon)</div>
      <div className="flex-1 text-xs opacity-60">In-game chat will appear here for real-time discussion.</div>
      <form className="mt-2 flex gap-2">
        <input
          type="text"
          className="rounded border p-1 flex-1"
          placeholder="Type a message..."
          disabled
        />
        <button
          type="submit"
          className="bg-primary text-white rounded px-2 font-semibold text-sm"
          disabled
        >Send</button>
      </form>
    </div>
  );
}
