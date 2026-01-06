import React, { useEffect, useState } from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'

function OrderPlaced() {
  const [showConfetti, setShowConfetti] = useState(true)
    const navigate=useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>

      {/* Confetti */}
      {showConfetti && <Confetti numberOfPieces={250} gravity={0.3} />}

      {/* Bouncing Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <FaCircleCheck className='text-green-500 text-6xl mb-4' />
      </motion.div>

      {/* Text animations */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='text-3xl font-bold text-gray-800 mb-2'
      >
        Order Placed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className='text-gray-600 max-w-md mb-6'
      >
        Thank you for purchasing. Your order is being prepared.
        You can track your order status in "My Orders" section.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition'
        onClick={()=>navigate("/my-orders")}
      >
        Back to my orders
      </motion.button>
    </div>
  )
}

export default OrderPlaced
