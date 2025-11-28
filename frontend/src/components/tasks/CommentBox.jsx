import React, { useState } from "react";
import { Send } from "lucide-react";

export default function CommentBox({ onSubmit }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(text.trim());
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      submit();
    }
  };

  return (
    <div className="space-y-3">
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        onKeyPress={handleKeyPress}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none" 
        rows={3} 
        placeholder="Write a comment... (Ctrl+Enter to send)"
      />
      <div className="flex justify-end">
        <button 
          onClick={submit} 
          disabled={!text.trim() || submitting}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  );
}
