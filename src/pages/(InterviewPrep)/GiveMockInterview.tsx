import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import DashNav from '@/components/dashnav/dashnav';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GiveMockInterview = () => {
  const navigate = useNavigate();


  const IntroBanner = () => (
    <div className="w-full bg-white rounded-[20px] p-5 mb-6">
      <p className="text-[#3A3A3A] text-sm text-base sm:text-lg leading-relaxed text-center">
        Gain real interview practice with industry experts. Improve your confidence, sharpen your skills, 
        and receive valuable feedback.
      </p>
    </div>
  );


  const [currentScreen, setCurrentScreen] = useState('form');
  

  const [bookingData, setBookingData] = useState({
    
    role: 'Python Development',
    
    
    selectedDate: { 
      day: 'SAT',    
      date: 23       
    },
    selectedTimeSlot: 'MORNING',      
    selectedTime: '10:00 AM',         
    
    
    selectedPrimarySkills: ['Skill 1'],     
    selectedSecondarySkills: [],            
    
    
    yearsExp: [1, 2],                       
    monthsExp: [1, 2, 3],                   
    
    
    selectedResume: 0,                      
    uploadedResume: null,                   
    
    
    interviewId: null                       
  });


  const [uploadedResumeFile, setUploadedResumeFile] = useState(null);

  

  const dates = [
    { day: 'SAT', date: 23 },
    { day: 'SUN', date: 24 },
    { day: 'MON', date: 25 },
    { day: 'TUE', date: 26 },
    { day: 'WED', date: 27 },
    { day: 'THU', date: 28 },
    { day: 'FRI', date: 29 }
  ];


  const timeSlots = {
    MORNING: ['10:00 AM', '10:30 AM', '11:00 AM'],
    AFTERNOON: ['11:30 AM', '12:00 PM', '12:30 PM'],
    EVENING: ['12:00 PM', '12:30 PM']
  };


  const primarySkills = [
    'Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 
    'Skill 5', 'Skill 6', 'Skill 7', 'Skill 8'
  ];
  
  const secondarySkills = [
    'Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5', 
    'Skill 6', 'Skill 7', 'Skill 8', 'Skill 9', 'Skill 10'
  ];


  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };


  const validateBookingData = () => {
    const errors = [];

    if (!bookingData.role) {
      errors.push('Role is required');
    }

    if (!bookingData.selectedDate) {
      errors.push('Date is required');
    }

    if (!bookingData.selectedTime) {
      errors.push('Time is required');
    }

    if (bookingData.selectedPrimarySkills.length === 0) {
      errors.push('At least one primary skill is required');
    }

    if (bookingData.yearsExp.length === 0 && bookingData.monthsExp.length === 0) {
      errors.push('Experience is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const prepareAPIPayload = () => {
    return {
      
      interview: {
        role: bookingData.role,
        date: {
          day: bookingData.selectedDate.day,
          date: bookingData.selectedDate.date,
          
          fullDate: null 
        },
        time: {
          slot: bookingData.selectedTimeSlot,
          specificTime: bookingData.selectedTime
        }
      },
      
      
      skills: {
        primary: bookingData.selectedPrimarySkills,
        secondary: bookingData.selectedSecondarySkills
      },
      
      
      experience: {
        years: bookingData.yearsExp,
        months: bookingData.monthsExp,
        
        totalMonths: (bookingData.yearsExp.reduce((a, b) => a + b, 0) * 12) + 
                     bookingData.monthsExp.reduce((a, b) => a + b, 0)
      },
      
      
      resume: {
        selectedIndex: bookingData.selectedResume,
        uploadedFileName: bookingData.uploadedResume,
        
        resumeId: null 
      },
      
      
      payment: {
        amount: 399.00,
        currency: 'INR',
        status: 'pending'
      },
      
      
      metadata: {
        timestamp: new Date().toISOString(),
        timezone: 'IST'
      }
    };
  };

  
  const handleBookInterview = () => {
    
    const validation = validateBookingData();
    
    if (!validation.isValid) {
      console.error('Validation Errors:', validation.errors);
      
      alert('Please fill in all required fields:\n' + validation.errors.join('\n'));
      return;
    }

    
    const apiPayload = prepareAPIPayload();
    
    console.log('='.repeat(80));
    console.log('BOOKING INTERVIEW - API PAYLOAD');
    console.log('='.repeat(80));
    console.log(JSON.stringify(apiPayload, null, 2));
    console.log('='.repeat(80));

    setCurrentScreen('payment');
  };

 
  const handlePayAndConfirm = () => {
    
    const interviewId = Math.floor(100000 + Math.random() * 900000);
    
    
    const confirmationPayload = {
      ...prepareAPIPayload(),
      interviewId,
      payment: {
        amount: 399.00,
        currency: 'INR',
        status: 'completed',
        transactionId: `TXN${Date.now()}`, 
        completedAt: new Date().toISOString()
      }
    };

    console.log('='.repeat(80));
    console.log('PAYMENT CONFIRMATION - API PAYLOAD');
    console.log('='.repeat(80));
    console.log(JSON.stringify(confirmationPayload, null, 2));
    console.log('='.repeat(80));

    setBookingData({ ...bookingData, interviewId });
    setCurrentScreen('success');
  };


  const handleCancel = () => {
    console.log('='.repeat(80));
    console.log('BOOKING CANCELLED');
    console.log('='.repeat(80));

    setCurrentScreen('form');
  };

 
  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }


    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }


    setUploadedResumeFile(file);
    setBookingData({
      ...bookingData,
      uploadedResume: file.name,
       selectedResume: 0
    });

    console.log('='.repeat(80));
    console.log('RESUME UPLOADED');
    console.log('='.repeat(80));
    console.log('File Name:', file.name);
    console.log('File Size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('File Type:', file.type);
    console.log('='.repeat(80));


  };


  const handleRemoveUploadedResume = () => {
    setUploadedResumeFile(null);
    setBookingData({
      ...bookingData,
      uploadedResume: null,
      selectedResume: 0
    });

    console.log('='.repeat(80));
    console.log('UPLOADED RESUME REMOVED');
    console.log('='.repeat(80));
  };


  const FormScreen = () => (
    <div className="max-w-[1400px] mx-auto">
      <IntroBanner />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        
        <div className="lg:col-span-2 space-y-5">


          <div className="bg-white rounded-[20px] py-5 px-5">
            <div className="flex items-center flex-wrap gap-3">
              <span className="text-[#3A3A3A] text-2xl">Role :</span>
              <span className="text-[#3A3A3A] text-2xl flex-1">{bookingData.role}</span>
              
              <button className="py-2 px-6 rounded-xl border border-[#FF9D48] text-[#FF9D48] text-sm hover:bg-orange-50">
                Change role
              </button>
              
              <button className="py-2 px-6 rounded-xl border border-[#FF9D48] text-[#FF9D48] text-sm hover:bg-orange-50">
                Create new role
              </button>
            </div>
          </div>


          <div className="bg-white rounded-[20px] py-5 px-5">
            <h2 className="text-[#F26D3A] text-2xl mb-5">Schedule your Mock Interview</h2>
            <div className="bg-[#E8E8E8] h-[1px] mb-5"></div>

            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-black text-base font-medium">DATE (IST)</span>
                <span className="text-black text-[10px]">Note: You can book interview(s) for 7 days from today.</span>
              </div>
              <div className="flex justify-between gap-2">
                {dates.map((item) => (
                  <button
                    key={item.date}
                    onClick={() => setBookingData({ ...bookingData, selectedDate: item })}
                    className={`flex flex-col w-20 py-3 gap-2 rounded-xl border ${
                      bookingData.selectedDate.date === item.date
                        ? 'bg-[#FFF0E3] border-[#F26D3A]'
                        : 'bg-white border-[#CACACA]'
                    }`}
                  >
                    <span className={`text-[10px] font-bold text-center ${
                      bookingData.selectedDate.date === item.date ? 'text-[#3A3A3A]' : 'text-[#7F7F7F]'
                    }`}>
                      {item.day}
                    </span>
                    <span className="text-black text-xl font-bold text-center">{item.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#DEDEDE] h-[1px] mb-8"></div>

            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-black text-base font-medium">TIME (IST)</span>
                <span className="text-black text-[10px]">Note: Each booking is scheduled for 1 hour.</span>
              </div>

              
              <div className="flex gap-5 mb-5">
                {['MORNING', 'AFTERNOON', 'EVENING'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setBookingData({ ...bookingData, selectedTimeSlot: slot })}
                    className={`flex-1 py-2 rounded-lg border text-sm ${
                      bookingData.selectedTimeSlot === slot
                        ? 'bg-[#FFF0E3] border-[#F26D3A] text-[#3A3A3A]'
                        : 'bg-white border-[#CACACA] text-[#3A3A3A]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              
              <div className="flex gap-3 flex-wrap">
                {timeSlots[bookingData.selectedTimeSlot].map((time) => (
                  <button
                    key={time}
                    onClick={() => setBookingData({ ...bookingData, selectedTime: time })}
                    className={`py-3 px-6 rounded-xl border text-sm ${
                      bookingData.selectedTime === time
                        ? 'bg-[#FFF0E3] border-[#F26D3A] text-[#3A3A3A]'
                        : 'bg-[#EDEDED] border-[#CACACA] text-[#3A3A3A]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>


          <div className="bg-white rounded-[20px] py-5 px-5">
            <h2 className="text-[#3A3A3A] text-xl font-semibold mb-5">SKILL & EXPERIENCE</h2>

            
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3 gap-4">
                <span className="text-[#3A3A3A] text-sm font-medium">PRIMARY SKILLS</span>
                <span className="text-[10px] text-[#3A3A3A] text-right">
                  Primary skills are taken from your job role. You can select multiple primary skills.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {primarySkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setBookingData({
                      ...bookingData,
                      selectedPrimarySkills: toggleArrayItem(bookingData.selectedPrimarySkills, skill)
                    })}
                    className={`py-2 px-3 rounded-lg text-sm border ${
                      bookingData.selectedPrimarySkills.includes(skill)
                        ? 'bg-[#FFF0E3] border-[#F26D3A] text-[#3A3A3A]'
                        : 'bg-[#FFF0E3] border-[#CACACA] text-[#3A3A3A]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3 gap-4">
                <span className="text-[#3A3A3A] text-sm font-medium">SECONDARY SKILLS</span>
                <span className="text-[10px] text-[#3A3A3A] text-right">
                  Secondary skills are skills that you think might be asked during your interview.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {secondarySkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setBookingData({
                      ...bookingData,
                      selectedSecondarySkills: toggleArrayItem(bookingData.selectedSecondarySkills, skill)
                    })}
                    className={`py-2 px-3 rounded-lg text-sm border ${
                      bookingData.selectedSecondarySkills.includes(skill)
                        ? 'bg-[#FFF0E3] border-[#F26D3A] text-[#3A3A3A]'
                        : 'bg-white border-[#CACACA] text-[#3A3A3A]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>


          <div className="bg-white rounded-[20px] py-5 px-5">
            <h2 className="text-[#3A3A3A] text-xl font-semibold mb-5">EXPERIENCE</h2>


            <div className="mb-5">
              <span className="text-[#3A3A3A] text-sm font-medium block mb-3">YEARS</span>
              <div className="flex items-center gap-1 flex-wrap">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((year) => (
                  <button
                    key={year}
                    onClick={() => setBookingData({
                      ...bookingData,
                      yearsExp: toggleArrayItem(bookingData.yearsExp, year)
                    })}
                    className={`w-8 h-8 text-xs rounded flex items-center justify-center ${
                      bookingData.yearsExp.includes(year)
                        ? 'bg-[#3A3A3A] text-white'
                        : 'bg-[#EDEDED] text-[#3A3A3A]'
                    }`}
                  >
                    {year}
                  </button>
                ))}
                <span className="text-xs text-[#3A3A3A] ml-2">+ 3 YEARS</span>
              </div>
            </div>


            <div>
              <span className="text-[#3A3A3A] text-sm font-medium block mb-3">MONTHS</span>
              <div className="flex items-center gap-1 flex-wrap">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <button
                    key={month}
                    onClick={() => setBookingData({
                      ...bookingData,
                      monthsExp: toggleArrayItem(bookingData.monthsExp, month)
                    })}
                    className={`w-8 h-8 text-xs rounded flex items-center justify-center ${
                      bookingData.monthsExp.includes(month)
                        ? 'bg-[#3A3A3A] text-white'
                        : 'bg-[#EDEDED] text-[#3A3A3A]'
                    }`}
                  >
                    {month}
                  </button>
                ))}
                <span className="text-xs text-[#3A3A3A] ml-2">+ 1 MONTH</span>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-[20px] py-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#3A3A3A] text-xl font-semibold">RESUME</h2>
              <span className="text-[10px] text-[#3A3A3A]">Your resume is taken from the Resume Wizard</span>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[0, 1].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setBookingData({ ...bookingData, selectedResume: idx, uploadedResume: null })}
                  className={`rounded-lg p-3 border-2 ${
                    bookingData.selectedResume === idx
                      ? 'border-[#F26D3A] bg-[#FFF9F5]'
                      : 'border-[#E5E5E5] bg-white'
                  }`}
                >
                  <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Resume Preview</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#3A3A3A]">Resume Name</span>
                    <button className="text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </button>
              ))}
            </div>


            {uploadedResumeFile && (
              <div className="mb-4 p-4 bg-[#FFF9F5] border-2 border-[#F26D3A] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF9D48] rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#3A3A3A]">{uploadedResumeFile.name}</p>
                      <p className="text-xs text-gray-500">{(uploadedResumeFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveUploadedResume}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="text-center mb-3">
              <span className="text-sm text-gray-500">OR</span>
            </div>


            <input
              type="file"
              id="resumeUpload"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />


            <label
              htmlFor="resumeUpload"
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#FF8351] hover:text-[#FF8351] flex items-center justify-center gap-2 mb-3 cursor-pointer transition-colors"
            >
              <Upload size={16} />
              Upload Resume (PDF, DOC, DOCX - Max 5MB)
            </label>

            <div className="text-center mb-3">
              <span className="text-sm text-gray-500">OR</span>
            </div>


            <button className="w-full py-3 border-2 border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#FF8351] hover:text-[#FF8351] flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                <path d="M3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                <path d="M14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Create Resume in Resizzy
            </button>
          </div>


          <div className="flex gap-3">
            <button 
              onClick={handleCancel}
              className="flex-1 py-3 rounded-lg text-sm font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleBookInterview}
              className="flex-1 py-3 rounded-lg text-sm font-semibold text-white cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
              }}
            >
              Book Mock Interview
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#FFF9F5] rounded-[20px] p-5 sticky top-6">
            <h3 className="text-[#3A3A3A] text-base font-semibold mb-4">Note</h3>
            <ul className="space-y-3 text-xs text-[#3A3A3A] leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#FF8351] mt-0.5">•</span>
                <span>The job role and experience for your interview will be based on your profile. To schedule an interview for a different role, please create a new role in your profile section.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF8351] mt-0.5">•</span>
                <span>Once your payment is complete, your interview request will be forwarded to our professionals, who will conduct the interview according to the available time slots.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF8351] mt-0.5">•</span>
                <span>You will receive a notification 2 hours before your interview and a reminder 30 minutes prior.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF8351] mt-0.5">•</span>
                <span>If you cancel the interview 3-4 hours in advance, you are eligible for a 50% refund. Cancellations made within 3 hours of the interview are non-refundable, as per our policy.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentScreen = () => (
    <div className="max-w-[1400px] mx-auto">
      <IntroBanner />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[20px] py-6 px-6">
            <h2 className="text-[#F26D3A] text-2xl mb-6">Details</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-[#3A3A3A] text-sm font-semibold mb-2">Date</h3>
                <div className="bg-[#FFF9F5] rounded-lg p-4 border border-[#FFE5D1]">
                  <div className="text-xs text-[#7F7F7F] mb-1">{bookingData.selectedDate.day}</div>
                  <div className="text-2xl font-bold text-[#3A3A3A]">{bookingData.selectedDate.date}</div>
                </div>
              </div>
              <div>
                <h3 className="text-[#3A3A3A] text-sm font-semibold mb-2">Time</h3>
                <div className="bg-[#FFF9F5] rounded-lg p-4 border border-[#FFE5D1]">
                  <div className="text-2xl font-bold text-[#3A3A3A]">{bookingData.selectedTime}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-[#F26D3A] text-lg font-semibold mb-1">Role : {bookingData.role}</h3>
              <p className="text-[#3A3A3A] text-sm">
                Experience : {bookingData.yearsExp.length} Years, {bookingData.monthsExp.length} Months
              </p>
            </div>


            <div className="mb-6">
              <h3 className="text-[#3A3A3A] text-base font-semibold mb-3">SKILL(S) SELECTED FOR MOCK INTERVIEW</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[...bookingData.selectedPrimarySkills, ...bookingData.selectedSecondarySkills].slice(0, 7).map((skill, idx) => (
                  <div key={idx} className="bg-[#F5F5F5] rounded-lg py-2 px-3 text-center text-sm text-[#3A3A3A]">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#E8E8E8] h-[1px] my-6"></div>


            <div className="flex justify-between items-center mb-6">
              <span className="text-[#3A3A3A] text-lg font-semibold">Amount :</span>
              <span className="text-[#3A3A3A] text-2xl font-bold">₹ 399.00 /-</span>
            </div>


            <button
              onClick={handlePayAndConfirm}
              className="w-full py-3 rounded-lg text-base font-semibold text-white cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
              }}
            >
              Pay and Confirm
            </button>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

              <div className="bg-[#FFF9E6] rounded-lg p-4">
                <h4 className="text-[#3A3A3A] font-semibold text-sm mb-2">
                  One IT Community, Endless Opportunities - NamaQA Community
                </h4>
                <button className="mt-2 px-4 py-2 bg-white border border-[#FF9D48] text-[#FF9D48] rounded-lg text-xs font-semibold hover:bg-orange-50">
                  Join Now →
                </button>
              </div>

              <div className="bg-[#F0F9FF] rounded-lg p-4">
                <h4 className="text-[#3A3A3A] font-semibold text-sm mb-2">
                  Create an ATS-Friendly Resume That Gets Past Filters and Reaches Employers
                </h4>
                <button className="mt-2 px-4 py-2 bg-white border border-[#3B82F6] text-[#3B82F6] rounded-lg text-xs font-semibold hover:bg-blue-50">
                  Create Resume
                </button>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-1">
          <div className="bg-[#FFF9F5] rounded-[20px] p-6 sticky top-6">
            <h3 className="text-[#3A3A3A] text-base font-semibold mb-4">Note</h3>
            <ul className="space-y-3 text-xs text-[#3A3A3A] leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#FF8351] mt-0.5">•</span>
                <span>The job role and experience for your interview will be based on your profile. To schedule an interview for a different role, please create a new role in your profile section.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF8351] mt-0.5">•</span>
                <span>Once your payment is complete, your interview request will be forwarded to our professionals, who will conduct the interview according to the available time slots.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF8351] mt-0.5">•</span>
                <span>You will receive a notification 2 hours before your interview and a reminder 30 minutes prior.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF8351] mt-0.5">•</span>
                <span>If you cancel the interview 3-4 hours in advance, you are eligible for a 50% refund. Cancellations made within 3 hours of the interview are non-refundable, as per our policy.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );


  const SuccessScreen = () => (
    <div className="max-w-[1400px] mx-auto">
      <IntroBanner />
      <div className="flex items-center justify-center min-h-[50px]">
        <div className="bg-white rounded-[20px] py-12 px-8 text-center max-w w-full">
          

          <div className="flex justify-center mb-6">
            <motion.div
              className="relative w-24 h-24"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >

              <motion.div
                className="absolute inset-0 rounded-full bg-[#4ADE80] opacity-20"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.5, 1.8], opacity: [0.3, 0.15, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: "easeOut" 
                }}
              />

              <motion.div
                className="absolute inset-0 rounded-full bg-[#4ADE80] opacity-20"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.5, 1.8], opacity: [0.3, 0.15, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  delay: 0.3,
                  ease: "easeOut" 
                }}
              />
              

              <motion.div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)",
                  boxShadow: "0 10px 40px rgba(74, 222, 128, 0.3)"
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 12,
                  delay: 0.1 
                }}
              >

                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M10 24L20 34L38 14"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4,
                      ease: "easeOut" 
                    }}
                  />
                </svg>
              </motion.div>
              

              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#4ADE80] rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 6) * 50,
                    y: Math.sin((i * Math.PI * 2) / 6) * 50,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6 + i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </div>


          <motion.h2 
            className="text-[#3A3A3A] text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Mock Interview Booking Confirmed
          </motion.h2>
          

          <motion.p 
            className="text-[#3A3A3A] text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            Interview ID: <span className="font-semibold">{bookingData.interviewId}</span>
          </motion.p>


          <motion.p 
            className="text-[#3A3A3A] text-sm mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            You will receive a notification 2 hours before your interview and a reminder 30 minutes prior the Mock Interview
          </motion.p>


          <motion.button
            onClick={() => navigate('/interview-prep')}
            className="py-3 px-8 rounded-lg text-base font-semibold text-white cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Interview Dashboard
          </motion.button>
        </div>
      </div>
    </div>
  );


  return (
    <div className="flex flex-col h-screen font-['Baloo_2']">

      <DashNav heading="Give Mock Interview" />


      <div className="flex-1 max-h-screen overflow-auto bg-[#F0F0F0] p-6">

        {currentScreen === 'form' && <FormScreen />}
        {currentScreen === 'payment' && <PaymentScreen />}
        {currentScreen === 'success' && <SuccessScreen />}
      </div>
    </div>
  );
};

export default GiveMockInterview;