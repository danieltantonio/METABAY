import React from 'react';
import Items from './Items';

function Home(props) {
    const { items } = props;

    return (
        <div>
            Home
            <Items items={items} />
        </div>
    )
}

export default Home;