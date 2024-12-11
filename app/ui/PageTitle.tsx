export default ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) =>
    <div className="flex flex-col items-center">
        <h1 className="text-2xl text-bold mb-1">
            {children}
        </h1>
    </div>