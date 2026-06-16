type ButtonProps = {
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "success";
};

export function Button({
    children,
    disabled,
    loading,
    onClick,
    type = "button",
    variant = "primary",
}: ButtonProps) {
    const variantClasses = {
        primary: "bg-black text-white",
        secondary: "bg-gray-200 text-black",
        success: "bg-emerald-600 text-white",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`rounded px-4 py-2 transition-opacity disabled:opacity-50 ${variantClasses[variant]}`}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}