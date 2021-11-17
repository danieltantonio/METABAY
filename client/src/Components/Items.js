import React from 'react';
import { Link } from 'react-router-dom';

function Items(props) {
    const { items } = props;
    return (
        <div className="Items">
            {
                items.map(item => {
                    return <Link to={`/item/${item}`} key={item}>{item}</Link>
                })
            }
        </div>
    )
}

export default Items;