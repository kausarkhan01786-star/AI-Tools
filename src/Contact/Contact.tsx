import React from 'react';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <p className="text-lg text-[#8E8E93] leading-relaxed mb-8">
        Have questions or feedback? We'd love to hear from you.
      </p>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Name" className="w-full px-6 py-4 bg-white rounded-2xl border border-[#E5E5EA] outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="email" placeholder="Email" className="w-full px-6 py-4 bg-white rounded-2xl border border-[#E5E5EA] outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <textarea placeholder="Message" rows={6} className="w-full px-6 py-4 bg-white rounded-2xl border border-[#E5E5EA] outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">Send Message</button>
      </form>
    </div>
  );
}
