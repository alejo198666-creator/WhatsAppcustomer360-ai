<p className="message-text">
    {message.text.split("\n").map((line,index)=>(
        <span key={index}>
            {line}
            <br/>
        </span>
    ))}
</p>