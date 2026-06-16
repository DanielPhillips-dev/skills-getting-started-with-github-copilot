type CardProps = {
    title?: string;
    children: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
    return (
        <section className="rounded-xl border p-4 shadow-sm">
            {title ? (
                <h2 className="mb-4 text-lg font-semibold">{title}</h2>
            ) : null}

            {children}
        </section>
    );
}