import React, { useState } from 'react';
import Airtable from 'airtable';
// Heart 아이콘 import 제거

// Airtable 설정
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

const NEISCalculator = () => {
    const [text, setText] = useState('');
    const [byteCount, setByteCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [noSpaceCount, setNoSpaceCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    // isSubmitting 상태 제거
   
    const calculateCounts = (str) => {
      let bytes = 0;
      let chars = 0;
      let noSpace = 0;
      
      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        chars += 1;
        
        if (charCode === 10 || charCode === 13) {
          bytes += 2;
          noSpace += 1;
        } else if (charCode >= 0xAC00 && charCode <= 0xD7A3 || 
                   charCode >= 0x3131 && charCode <= 0x318E) {
          bytes += 3;
          noSpace += 1;
        } else if (charCode === 32) {
          bytes += 1;
        } else {
          bytes += 1;
          noSpace += 1;
        }
      }
      
      return { bytes, chars, noSpace };
    };
   
    const handleTextChange = (e) => {
      const newText = e.target.value;
      setText(newText);
      const counts = calculateCounts(newText);
      setByteCount(counts.bytes);
      setCharCount(counts.chars);
      setNoSpaceCount(counts.noSpace);
    };

    const handleLike = async () => {
      if (isLiked || !text.trim()) return;
      
      setLikeCount(prev => prev + 1);
      setIsLiked(true);

      try {
        // 백그라운드에서 조용히 저장
        await base('SavedTexts').create([
          {
            fields: {
              'Count': 1,
              'Text Content': text
            }
          }
        ]);
      } catch (error) {
        console.error('Error saving to Airtable:', error);
      }
    };
   
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">나이스(NEIS) 글자수 계산기 2025ver.</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <textarea
                className="w-full h-96 p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                value={text}
                onChange={handleTextChange}
                placeholder="여기에 텍스트를 입력하세요..."
              />
            </div>
    
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-md">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">공백 제외</p>
                    <p className="text-2xl font-bold">{noSpaceCount}자</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">공백 포함</p>
                    <p className="text-2xl font-bold">{charCount}자</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">바이트 수</p>
                    <p className="text-2xl font-bold">{byteCount}바이트</p>
                  </div>
                </div>
              </div>
    
              <div className="mb-4 flex justify-end items-center space-x-2">
                <span className="text-lg text-gray-500 font-bold">좋아요를 눌러주세요</span>
                <button
                  onClick={handleLike}
                  disabled={isLiked || !text.trim()}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
                    isLiked 
                      ? 'bg-pink-100 text-pink-500' 
                      : 'bg-white hover:bg-pink-50 text-gray-600 hover:text-pink-500'
                  }`}
                >
                  <span>❤️</span>
                  <span>{likeCount}</span>
                </button>
              </div>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="p-3 text-center border-r border-gray-700">항목</th>
                      <th className="p-3 text-center border-r border-gray-700">자율활동</th>
                      <th className="p-3 text-center border-r border-gray-700">동아리활동</th>
                      <th className="p-3 text-center border-r border-gray-700">진로활동</th>
                      <th className="p-3 text-center border-r border-gray-700">교과세특</th>
                      <th className="p-3 text-center">개인별세특</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 text-center border-t border-r border-gray-200 bg-gray-50">바이트</td>
                      <td className="p-3 text-center border-t border-r border-gray-200">1500Bytes</td>
                      <td className="p-3 text-center border-t border-r border-gray-200">1500Bytes</td>
                      <td className="p-3 text-center border-t border-r border-gray-200">2100Bytes</td>
                      <td className="p-3 text-center border-t border-r border-gray-300">1500Bytes</td>
                      <td className="p-3 text-center border-t border-gray-200">1500Bytes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
    
              <div className="mt-4 text-gray-500 text-right font-bold text-lg">
                <div className="flex items-center justify-end">
                  <p className="leading-relaxed">
                    영어, 숫자, 특수문자, 띄어쓰기: 1Bytes / 줄바꿈: 2Bytes / 한글: 3Bytes<br />
                    <br />
                    <span className="text-gray-400 italic text-xl">Developed by ScholarShift</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default NEISCalculator;