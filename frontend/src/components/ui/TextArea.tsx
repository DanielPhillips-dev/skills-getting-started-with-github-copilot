type TextAreaProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
};

export function TextArea({
    value,
    onChange,
    placeholder,
    rows = 4,
}: TextAreaProps) {
    return (
        <textarea
            className="w-full rounded border p-2"
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}