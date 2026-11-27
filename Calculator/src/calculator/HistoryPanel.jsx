export default function HistoryPanel({ history, isDark, onSelect, onClear }) {
  return (
    <div className="flex flex-col justify-between h-[310px] pt-2">
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-right">
        {history.length === 0 ? (
          <div className={`text-center text-xs pt-24 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            No history yet
          </div>
        ) : (
          history.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(item.result)}
              className={`w-full text-right pb-2 border-b transition hover:opacity-80 cursor-pointer ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}
            >
              <div className={`text-xs tabular-nums ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {item.expression}
              </div>
              <div className="text-base font-medium text-[#68b85a] tabular-nums">
                ={item.formattedResult}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="pt-3 flex justify-center">
        <button
          type="button"
          onClick={onClear}
          disabled={history.length === 0}
          className="px-6 py-2 rounded-full bg-[#3b872a] text-white text-xs font-medium hover:brightness-110 active:scale-95 transition disabled:opacity-40 cursor-pointer"
        >
          Clear history
        </button>
      </div>
    </div>
  );
}
