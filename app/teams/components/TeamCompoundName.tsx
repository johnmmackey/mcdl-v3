export const TeamCompoundName = (props: { id: string, name: string }) => {
    return (
        <>
            <span className="hidden md:inline">
                {`${props.name}`}
            </span>
            <span className="inline md:hidden">
                {`${props.id}`}
            </span>
        </>
    );
}