type ConversationItemProps = {
  title: string;
  active?: boolean;
};

export default function ConversationItem({
  title,
  active = false,
}: ConversationItemProps) {
  return (
    <div
      className={`p-3 rounded-xl border cursor-pointer transition ${
        active
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-[var(--border)] bg-background hover:border-indigo-500"
      }`}
    >
      <p className="font-medium truncate">
        {title}
      </p>

      <p className="text-sm text-foreground/60 mt-1">
        Updated just now
      </p>
    </div>
  );
}