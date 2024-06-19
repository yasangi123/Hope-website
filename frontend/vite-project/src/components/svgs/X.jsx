import React from 'react';

const LogoImage = (props) => (
    <img src="/logo.png" alt="Logo" {...props} /> // Renders an img element with src set to "/logo.png" and alt text "Logo", spreading any additional props
);

export default LogoImage; // Export the LogoImage component as default
