import React, { useState } from 'react';

export function ButtonTeste(props) {
    const [number, setNumber] = useState(100);
    const [ronan, setRonan] = useState()
    // let number = 0

    function soma() {
        // console.log('teste', number)
        // number = number + 1;
        setNumber(number + 1)
    }
    return (
        <>
            <button onClick={soma}>{props.name}</button>
            <p>{number}</p>
        </>
    )
}