
import { useState } from 'react'

const EmailVerify = () => {
  const [fromData, setFromData] = useState({ email: '', otp: '' })


  const handelchange = (e) => {
    const { name, vaule } = e.target;
    setFromData(pre => ({ ...ProgressEvent, [name]: value }))

  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-6'>
          Email Verfication
        </h2>
        <from onsubmit={verifyOtp}>
          <input
            type='email'
            name='email'
            value={fromData.email}
            onChange={handelchange}
            placeholder='Enter your Email'
            className='flex-1 px-4 py-2 rounded bg-[#333a5c text-white out-none focus:ring-indigo-500 required' />
          <div>
            <button type='button'
              onClick={sendOtp}
              className='px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition duration-200 '>
              Send OTP
            </button>
          </div>

          <button type='submit'
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 hover:from-indigo-800 text-white font-medium transition duration-200'>
            Verify OTP
          </button>
        </from>
      </div>
   </div>
  )
}

export default EmailVerify
