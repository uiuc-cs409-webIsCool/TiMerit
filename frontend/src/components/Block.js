function Block({id, content, onDragStart, onDragOver, onDrop}) {
    return (
        <div
            id={id}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="block"
        >
            <h1>{content}</h1>
        </div>
    )
}

export default Block;