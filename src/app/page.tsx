'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'split' | 'postgresql'>('split');
  const [connectionLink, setConnectionLink] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState<any[]>([]);
  const [columns, setColumns] = useState(12);
  const [rows, setRows] = useState(4096);
  const [encoding, setEncoding] = useState('UTF-8');
  const [delimiter, setDelimiter] = useState(';');
  const [useFirstRowAsHeader, setUseFirstRowAsHeader] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isConnectionView, setIsConnectionView] = useState(false); // New state
  const [connectionDetails, setConnectionDetails] = useState({
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: ''
  });
  const [isPostgreSQLView, setIsPostgreSQLView] = useState(false); // New state for PostgreSQL view

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsFileUploaded(false);
    setFileName('');
    setFileData([]);
    setIsSplitView(false);
    setIsConnectionView(false);
    setIsPostgreSQLView(false);
  };

  // Open modal automatically after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      openModal();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    // Check if it's a database connection link
    if (connectionLink.startsWith('postgresql://') || connectionLink.startsWith('postgres://')) {
      // Parse connection string and populate connection details
      try {
        const url = new URL(connectionLink);
        const host = url.hostname;
        const port = url.port || '5432';
        const database = url.pathname.substring(1);
        const username = url.username;
        const password = url.password;

        setConnectionDetails({
          host,
          port,
          database,
          username,
          password
        });

        setIsConnectionView(true);
        setIsPostgreSQLView(true);
      } catch (error) {
        console.error('Invalid connection string', error);
      }
    } else {
      // Handle regular continue logic
      console.log('Connection link:', connectionLink);
    }
  };

  const handleConnect = () => {
    // Handle PostgreSQL connection
    console.log('Connecting to PostgreSQL with details:', connectionDetails);
    // In a real app, this would establish the actual connection
    closeModal();
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      // Show loading state
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // After upload completes, process the file
            processFile(files[0]);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const processFile = (file: File) => {
    // Simulate file processing
    setTimeout(() => {
      setFileName(file.name);
      setIsUploading(false);
      setIsSplitView(true);
    }, 500);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setIsFileUploaded(true);
    setIsSplitView(true);

    // Simulate processing file data
    const mockData = [];
    for (let i = 0; i < 12; i++) {
      mockData.push({
        col1: `Row ${i + 1} Data 1`,
        col2: `Row ${i + 1} Data 2`,
        col3: `Row ${i + 1} Data 3`,
        col4: `Row ${i + 1} Data 4`,
        col5: `Row ${i + 1} Data 5`,
      });
    }
    setFileData(mockData);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportCSV = () => {
    // Close modal and update canvas
    closeModal();

    // In a real app, this would add the CSV node to the workflow
    // For now, we'll just show a success message in the console
    console.log(`CSV file "${fileName}" imported successfully`);
  };

  const columnTypes = ['Text', 'Integer', 'Boolean', 'Date'];
  const getRandomColumnType = () => {
    return columnTypes[Math.floor(Math.random() * columnTypes.length)];
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-gray-50 border-b border-gray-200 shadow-sm py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Home</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            Help
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            Preference
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Data Sources */}
        <div className="w-64 bg-gray-50 shadow-md p-4 flex flex-col">
          <h2 className="font-semibold text-gray-700 mb-3">Nodes</h2>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 font-bold">D</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Node{item}</p>
                    <p className="text-xs text-gray-500">Description</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Recent Workflows</h3>
            <div className="space-y-2">
              {[1, 2].map((item) => (
                <div key={item} className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors text-sm">
                  Workflow {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Canvas Toolbar */}
              <div className="bg-white border-b border-gray-200 p-3 flex items-center space-x-4">
                <button className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">
                  Execute
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">
                  Reset
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <button className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">
                  Create Metanode
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">
                  Create Component
                </button>
              </div>

              {/* Canvas Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-lg h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Workflow Canvas</h3>
                    <p className="text-gray-500 max-w-md mb-12">
                      Drag and drop nodes or data files (CSV, XLSX, JSON, XML) to build and connect your workflow.
                    </p>
                    <button
                      onClick={openModal}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add Data
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Properties/Inspector */}
            <div className="w-80 bg-white shadow-md p-4 flex flex-col">
              <h2 className="font-semibold text-gray-700 mb-3">Properties</h2>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Selected Node</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium">CSV Reader</p>
                  <p className="text-xs text-gray-500">Reads CSV files from the file system</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Parameters</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm">Parameter {item}</span>
                      <input
                        type="text"
                        className="px-2 py-1 border border-gray-300 rounded text-sm w-24"
                        placeholder="Value"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          {/* Footer - Preview */}
          <div className="w-full bg-white shadow-md p-4 flex flex-col border-t border-gray-200">

            <div className="mt-auto">
              <h3 className="font-medium text-gray-700 mb-2">Node Preview</h3>
              <div className="bg-gray-50 rounded-md p-3 h-32 flex items-center justify-center">
                <p className="text-xs text-gray-500">Preview data here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-[758px] h-[784px] p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Loading state */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                <div className="w-full max-w-md p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Processing file...</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-4">Add your data</h2>

            {/* Horizontal divider */}
            <div className="border-t border-gray-200 mb-6"></div>

            {/* Split view content */}
            {isSplitView && !isPostgreSQLView ? (
              <div className="flex h-[calc(100%-80px)]">
                {/* Left panel - 280px */}
                <div className="w-[296px] border-r border-gray-200 flex flex-col pr-4">
                  <h3 className="font-semibold text-lg mb-4">Setup CSV</h3>
                  <h3 className="font-semibold">We've configured your file</h3>
                  <p className="text-gray-600 text-sm mb-4">You can review or adjust the settings below.</p>

                  <div className="space-y-4 mb-6 flex-1 overflow-y-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Columns detected</label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                        {columns}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rows detected</label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                        {rows}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Encoding</label>
                      <select
                        value={encoding}
                        onChange={(e) => setEncoding(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                      >
                        <option value="UTF-8">UTF-8</option>
                        <option value="ASCII">ASCII</option>
                        <option value="ISO-8859-1">ISO-8859-1</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
                      <select
                        value={delimiter}
                        onChange={(e) => setDelimiter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value=";">Semicolon (;)</option>
                        <option value=",">Comma (,)</option>
                        <option value="\t">Tab (\t)</option>
                        <option value="|">Pipe (|)</option>

                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useFirstRowAsHeader"
                        checked={useFirstRowAsHeader}
                        onChange={(e) => setUseFirstRowAsHeader(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="useFirstRowAsHeader" className="ml-2 block text-sm text-gray-700">
                        Use first row as header
                      </label>
                    </div>

                    <div className="mb-6 border-t border-gray-200 pt-4">
                      <button
                        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span className="font-medium">Advanced settings</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {showAdvancedSettings && (
                        <div className="mt-4 text-sm">
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Column Types</h4>
                            <p className="text-gray-600 mb-6">We inferred data types based on sampled values. Adjust them if needed.</p>
                            <div className="space-y-2">
                              {['Column_1', 'Column_2', 'Column_3', 'Column_4', 'Column_5', 'Column_6', 'Column_7', 'Column_8'].map((col, index) => (
                                <div key={index} className="flex items-center gap-6">
                                  <span className="flex-1 text-sm">{col}</span>
                                  <select
                                    className="w-[144px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                                    defaultValue={getRandomColumnType()}
                                  >
                                    <option value="Text">Text</option>
                                    <option value="Integer">Integer</option>
                                    <option value="Boolean">Boolean</option>
                                    <option value="Date">Date</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Null Value Handling</h4>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                              <option>Empty cells only</option>
                              <option>All null values</option>
                              <option>Custom values</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fixed buttons at bottom */}
                  <div className="flex flex-col space-y-3 mt-auto">
                    <button
                      onClick={() => {
                        // Add CSV node to canvas
                        const canvas = document.querySelector('.bg-white.rounded-lg.h-full.flex.items-center.justify-center');
                        if (canvas) {
                          // Hide the initial canvas content
                          const initialContent = canvas.querySelector('.text-center.p-8');
                          if (initialContent) {
                            (initialContent as HTMLElement).style.display = 'none';
                          }

                          const nodeElement = document.createElement('div');
                          nodeElement.className = 'absolute bg-blue-100 border border-blue-300 rounded-md p-3 shadow-md';
                          nodeElement.style.left = '50%';
                          nodeElement.style.top = '50%';
                          nodeElement.style.transform = 'translate(-50%, -50%)';
                          nodeElement.innerHTML = `
                            <div class="flex items-center space-x-2">
                              <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <span class="text-white font-bold">D</span>
                              </div>
                              <div>
                                <p class="font-medium text-sm">${fileName}</p>
                                <p class="text-xs text-gray-500">CSV Reader</p>
                              </div>
                            </div>
                          `;
                          canvas.appendChild(nodeElement);

                          // Update canvas text
                          const canvasText = canvas.querySelector('h3');
                          if (canvasText) {
                            canvasText.textContent = `${fileName} added to workflow`;
                          }
                        }
                        closeModal();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Import CSV
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Right panel - fits remaining width */}
                <div className="flex-1 pl-4 overflow-auto">
                  <h3 className="font-semibold text-lg mb-4">{fileName}</h3>
                  <h3 className="font-semibold mb-4">Preview (first 1,000 rows)</h3>

                  <div className="border border-gray-200 rounded-md overflow-hidden" style={{ overflowX: 'auto' }}>
                    <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: 'max-content' }}>
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header 1</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header 2</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header 3</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header 4</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header 5</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[...Array(8)].map((_, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Value {index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Value {index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Value {index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Value {index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Value {index + 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : isPostgreSQLView ? (
              // PostgreSQL connection view
              <div className="flex h-[calc(100%-80px)]">
                {/* Left panel - Connection details */}
                <div className="w-[296px] border-r border-gray-200 flex flex-col pr-4">
                  <h3 className="font-semibold text-lg mb-4">PostgreSQL Connection</h3>
                  <p className="text-gray-600 text-sm mb-4">Configure your PostgreSQL connection details.</p>

                  <div className="space-y-4 mb-6 flex-1 overflow-y-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                      <input
                        type="text"
                        value={connectionDetails.host}
                        onChange={(e) => setConnectionDetails({ ...connectionDetails, host: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        placeholder="localhost"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                      <input
                        type="text"
                        value={connectionDetails.port}
                        onChange={(e) => setConnectionDetails({ ...connectionDetails, port: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        placeholder="5432"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Database</label>
                      <input
                        type="text"
                        value={connectionDetails.database}
                        onChange={(e) => setConnectionDetails({ ...connectionDetails, database: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        placeholder="my_database"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        value={connectionDetails.username}
                        onChange={(e) => setConnectionDetails({ ...connectionDetails, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        placeholder="user"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={connectionDetails.password}
                        onChange={(e) => setConnectionDetails({ ...connectionDetails, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="mt-6 space-y-2">
                      <button
                        onClick={handleConnect}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Connect
                      </button>

                      <button
                        onClick={closeModal}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right panel - Connection test and preview */}
                <div className="flex-1 pl-4 overflow-auto">
                  <h3 className="font-semibold text-lg mb-4">Connection Preview</h3>
                  <p className="text-gray-600 text-sm mb-4">Review your connection details before connecting.</p>

                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50 mb-6">
                    <h4 className="font-medium mb-2">Connection Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="w-32 text-gray-600">Host:</span>
                        <span className="font-mono">{connectionDetails.host || 'localhost'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-600">Port:</span>
                        <span className="font-mono">{connectionDetails.port || '5432'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-600">Database:</span>
                        <span className="font-mono">{connectionDetails.database || 'my_database'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-gray-600">Username:</span>
                        <span className="font-mono">{connectionDetails.username || 'user'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-md p-4 bg-blue-50">
                    <h4 className="font-medium mb-2">Connection Status</h4>
                    <p className="text-sm text-gray-600">Connection details configured successfully. Click "Connect" to establish connection.</p>
                  </div>
                </div>
              </div>
            ) : (
              // Original drop zone content
              <div className="overflow-y-auto h-[calc(100%-80px)] pr-2">
                <p className="text-lg font-semibold mb-2">Drag and drop a file to get started</p>
                <p className="text-gray-600 mb-4">We’ll detect columns, data types, and formatting automatically.</p>
                {/* Drop zone */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center mb-8"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                  }}
                  onDrop={handleFileDrop}
                >
                  <p className="text-gray-700 font-medium">Drag and Drop CSV, Excel, JSON, or XML files here, or browse files</p>
                  <p className="text-gray-500 text-sm mt-2">Supported formats: CSV, Excel (XLSX), JSON, XML</p>
                </div>


                {/* Or connect via link */}
                <div className="mb-8">
                  <p className="text-lg font-semibold mb-2">Or connect via link or connection string</p>
                  <p className="text-gray-600 mb-4">Paste a connection link and we’ll configure it for you.</p>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={connectionLink}
                      onChange={(e) => setConnectionLink(e.target.value)}
                      placeholder="postgresql://user@host/db"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    />
                    <button
                      onClick={handleContinue}
                      disabled={!connectionLink.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Source type will be detected automatically</p>
                </div>

                {/* Browse all supported data sources */}
                <div className="mb-6">
                  <p className="text-lg font-semibold mb-4">Browse all supported data sources</p>
                  <p className="text-gray-600 mb-4">Explore available connectors and connect in just a few steps.</p>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Card 1 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">CSV / Excel</h3>
                      <p className="text-sm text-gray-600">Structured spreadsheet data</p>
                    </div>

                    {/* Card 2 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">PostgreSQL</h3>
                      <p className="text-sm text-gray-600">Relational database connection</p>
                    </div>

                    {/* Card 3 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">MySQL</h3>
                      <p className="text-sm text-gray-600">Microsoft relational database</p>
                    </div>

                    {/* Card 4 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">SQL Server</h3>
                      <p className="text-sm text-gray-600">Microsoft relational database</p>
                    </div>

                    {/* Card 5 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">Google Drive</h3>
                      <p className="text-sm text-gray-600">Files from cloud storage</p>
                    </div>

                    {/* Card 6 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">Amazon S3</h3>
                      <p className="text-sm text-gray-600">Cloud object storage files</p>
                    </div>

                    {/* Card 7 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">SharePoint</h3>
                      <p className="text-sm text-gray-600">Shared organizational docs</p>
                    </div>

                    {/* Card 8 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">REST API</h3>
                      <p className="text-sm text-gray-600">Live data endpoints</p>
                    </div>

                    {/* Card 9 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">JSON</h3>
                      <p className="text-sm text-gray-600">Structured nested data files</p>
                    </div>

                    {/* Card 10 */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-1">XML</h3>
                      <p className="text-sm text-gray-600">Hierarchical structured data</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}