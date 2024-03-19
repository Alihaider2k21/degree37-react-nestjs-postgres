import React, { useEffect, useState } from 'react';

import { Button } from 'react-bootstrap';
function BluePrintButton({ onClick, label, name, weekdays }) {
  const [color, setColor] = useState('#1C71EF');
  const [backColor, setBackColor] = useState('#CBDFFD');

  useEffect(() => {
    if (weekdays[name]) {
      setBackColor('#1a6ce5');
      setColor('#fff');
    } else {
      setBackColor('#CBDFFD');
      setColor('#1C71EF');
    }
  }, [weekdays]);
  return (
    <Button
      name={name}
      style={{
        backgroundColor: backColor,
        color: color,
        border: '0px',
        marginRight: '5px',
      }}
      variant="primary"
      size="sm"
      active
      onClick={() => {
        onClick(name);
        color === '#1C71EF' ? setColor('#fff') : setColor('#1C71EF');
        backColor === '#CBDFFD'
          ? setBackColor('#1a6ce5')
          : setBackColor('#CBDFFD');
      }}
    >
      {label}
    </Button>
  );
}
export default BluePrintButton;
