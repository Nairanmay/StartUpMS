"use client";

// Reuse the exact same code logic as Admin, but distinct page title
import { useEffect, useState } from "react";
import { 
  FileText, Search, Upload, Trash2, Download, X, File, Image as ImageIcon, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getDocuments, uploadDocument, deleteDocument } from "@/lib/api";

export default function UserDocumentHub() {
  // You can just copy the 'DocumentHubInterface' component code from the Admin file 
  // and paste it here, OR make it a shared component in /components if you prefer.
  // For simplicity, I will paste the minimal wrapper here assuming you copy the helper function below.
  
  return <DocumentHubInterface title="Team Documents" role="user" />;
}

// *** PASTE THE SAME 'DocumentHubInterface' FUNCTION HERE AS ABOVE ***
// (The one starting with function DocumentHubInterface({ title, role }) { ... })
// Ensure you include all imports at the top.

function DocumentHubInterface({ title }) {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Upload Form State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDocs(documents);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredDocs(documents.filter(d => 
        d.title.toLowerCase().includes(lower) || 
        (d.description && d.description.toLowerCase().includes(lower))
      ));
    }
  }, [searchQuery, documents]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load docs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) return;

    try {
      await uploadDocument(uploadFile, uploadTitle, uploadDesc);
      await fetchData(); // Refresh list
      setIsUploading(false);
      setUploadFile(null);
      setUploadTitle("");
      setUploadDesc("");
    } catch (err) {
      alert("Failed to upload document.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert("Failed to delete document.");
    }
  };

  const getIcon = (type) => {
    if (type === 'pdf') return <FileText className="w-8 h-8 text-red-500" />;
    if (type === 'img') return <ImageIcon className="w-8 h-8 text-blue-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12 font-sans text-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-1">Access and share team files.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsUploading(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-lg"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No documents found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredDocs.map(doc => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl">{getIcon(doc.file_type)}</div>
                    <button onClick={() => handleDelete(doc.id)} className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-semibold truncate" title={doc.title}>{doc.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 flex justify-between">
                    <span>{doc.date}</span><span>{doc.file_size}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">By {doc.uploaded_by_username}</p>
                  
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition flex justify-center bg-white/90 backdrop-blur rounded-b-2xl">
                    <a href={doc.file} target="_blank" className="text-blue-600 font-medium flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploading && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsUploading(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Upload Document</h2>
                <button onClick={() => setIsUploading(false)}><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required type="text" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20" 
                  />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer relative">
                  <input required type="file" onChange={e => setUploadFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <p className="text-sm text-gray-600">{uploadFile ? uploadFile.name : "Click to select file"}</p>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">Upload</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}