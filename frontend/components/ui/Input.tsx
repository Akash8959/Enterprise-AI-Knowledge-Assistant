type InputProps = {
  type?: string;
  placeholder?: string;
};

export default function Input({
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-3 outline-none focus:border-indigo-500 transition"
    />
  );
}