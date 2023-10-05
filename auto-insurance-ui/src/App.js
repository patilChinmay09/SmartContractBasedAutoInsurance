import './App.css';
import IssuePage from './Components/IssuePage';
import NavHead from './Components/NavHead';
import { useState } from 'react';
import ModifyPolicy from './Components/ModifyPolicy';

function App() {
  const [selectedPage, setSelectedPage] = useState('issuePolicy');

    const handlePageChange = (page) => {
        setSelectedPage(page);
    };
  return (
    <div className="App">
      <NavHead onPageChange={handlePageChange} currentPage={selectedPage}/>
      
      {selectedPage === 'issuePolicy' && (
                    <IssuePage></IssuePage>
                )}
                {selectedPage === 'modifyPolicy' && (
                    <ModifyPolicy />
                )}
    </div>
  );
}

export default App;
