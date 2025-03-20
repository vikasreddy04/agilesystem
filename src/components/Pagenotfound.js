import React from 'react'

export const Pagenotfound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <img 
                src="/images/pagenotfound.png"  // Ensure this matches your actual image file name
                alt="Page Not Found" 
                style={{ width: '400px', height: 'auto' }} 
            />
            <h1><b> OOPS! PAGE NOT FOUND.</b></h1>
            <a href="/">Go Back Home</a>
        </div>
    );
}
