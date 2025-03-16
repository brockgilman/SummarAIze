import React, { useState } from 'react';

const TextBox = () => {
  // State to store the input and saved value for each text box
  const [inputValue1, setInputValue1] = useState('');
  const [savedValue1, setSavedValue1] = useState('');

  const [inputValue2, setInputValue2] = useState('');
  const [savedValue2, setSavedValue2] = useState('');

  const [inputValue3, setInputValue3] = useState('');
  const [savedValue3, setSavedValue3] = useState('');

  // Handle input change for each text box
  const handleInputChange1 = (e) => setInputValue1(e.target.value);
  const handleInputChange2 = (e) => setInputValue2(e.target.value);
  const handleInputChange3 = (e) => setInputValue3(e.target.value);

  // Handle saving the input value for each text box
  const handleSave1 = () => setSavedValue1(inputValue1);
  const handleSave2 = () => setSavedValue2(inputValue2);
  const handleSave3 = () => setSavedValue3(inputValue3);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
      {/* Text Box 1 */}
      <div>
        <textarea
          value={inputValue1}
          onChange={handleInputChange1}
          placeholder="Type something here..."
          rows="5"
          cols="40"
        />
        <br />
        <button onClick={handleSave1}>Save</button>
        <div>
          <h3>Saved Text 1:</h3>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {savedValue1}
          </p>
        </div>
      </div>
      
      {/* Text Box 2 */}
      <div>
        <textarea
          value={inputValue2}
          onChange={handleInputChange2}
          placeholder="Type something here..."
          rows="5"
          cols="40"
        />
        <br />
        <button onClick={handleSave2}>Save</button>
        <div>
          <h3>Saved Text 2:</h3>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {savedValue2}
          </p>
        </div>
      </div>

      {/* Text Box 3 */}
      <div>
        <textarea
          value={inputValue3}
          onChange={handleInputChange3}
          placeholder="Type something here..."
          rows="5"
          cols="40"
        />
        <br />
        <button onClick={handleSave3}>Save</button>
        <div>
          <h3>Saved Text 3:</h3>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {savedValue3}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextBox;
