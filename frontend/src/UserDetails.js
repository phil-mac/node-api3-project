import React from 'react';

export default (props) => {
    return(
        <div style={{background: 'coral', position: 'fixed', width: '100%', height: '50vh' }}>
            <h3>User Details for uid: {props.params.id}</h3>
        </div>
    )
}